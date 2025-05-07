import React, {useEffect, useState} from 'react';
import {View, Dimensions, ScrollView, Text} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Bold from '../../../typography/BoldText';
import Regular from '../../../typography/RegularText';
import styles from './style';
import {Row} from '../../../components/atoms/row';
import ProductHeader from '../../../components/Headers/ProductHeader';
import ProductFooter from '../../../components/Footer/ProductFooter';
import AddModal from '../../../components/Modals/AddModal';
import ProviderInfo from '../../../components/Structure/ProviderInfo/ProviderInfo';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFavorite,
  removeFavorite,
} from '../../../redux/slices/favoritesSlice';

import {SafeAreaView} from 'react-native-safe-area-context';
import {mvs} from '../../../util/metrices';
import ProductMenu from '../../../components/Structure/ProductMenu/ProductMenu';
import {colors} from '../../../util/color';
import {MarkerSVG} from '../../../assets/svg';
import ShareActions from '../../../components/Structure/ShareAction/ShareAction';
import ProductImages from './ProductImages';
import {addToCart, getProduct} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import Loader from '../../../components/Loader';
import {addItem} from '../../../redux/slices/cartSlice';

const {height} = Dimensions.get('window');

const ProductDetail = () => {
  const [likedItems, setLikedItems] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerTitleVisible, setHeaderTitleVisible] = useState(false); // Track header title visibility
  const dispatch = useDispatch();
  const {token, role} = useSelector(state => state.user);
  const route = useRoute();
  const {productId} = route.params;
  const [addingToCart, setAddingToCart] = useState(false);
  const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProductDetails = async () => {
      // console.log('Fetching product details using API Service...');
      setLoading(true);
      try {
        const response = await getProduct(productId, token, role);
        if (response && response.success !== false) {
          setProduct(response.data);
          console.log('Product Data setting: ', response.data);
        } else {
          console.warn(
            'Failed to fetch product:',
            response?.message || 'Unknown error',
          );
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, token, role, dispatch]);

  const handleHeartPress = id => {
    setLikedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleHeartClick = (id, product) => {
    if (likedItems[id]) {
      // If the product is already in the favorites, remove it
      dispatch(removeFavorite(product));
      setLikedItems(prevState => {
        const updatedState = {...prevState};
        delete updatedState[id];
        return updatedState;
      });
      console.log('Removed from favorites:', product);
    } else {
      // If the product is not in the favorites, add it
      dispatch(addFavorite(product));
      setLikedItems(prevState => ({
        ...prevState,
        [id]: true, // Mark this product as liked
      }));
      console.log('Added to favorites:', product);
    }
  };

  const onClose = () => {
    setIsModalVisible(false);
    setLikedItems(false);
  };

  const handleBuyPress = async () => {
    if (!product) return;

    setAddingToCart(true);

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `https://backend.souqna.net${product.images?.[0]?.path}`,
        quantity: 1,
        stock: product.stock,
      }),
    );
    console.log('Added to Redux:', {
      id: product.id,
      name: product.name,
      price: product.price,
      image: `https://backend.souqna.net${product.images?.[0]?.path}`,
      quantity: 1,
      stock: product.stock,
    });

    const result = await addToCart(product.id, 1);

    if (result?.success) {
      console.log('Product added to backend cart successfully:', result);
      setShowAddedSnackbar(true);
    } else {
      console.warn('Failed to add to backend cart:', result);
    }
    setAddingToCart(false);

    setShowAddedSnackbar(true);
  };

  const onScroll = event => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY > height * 0.25) {
      setHeaderTitleVisible(true);
    } else {
      setHeaderTitleVisible(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading || !product ? (
        <Loader width={mvs(220)} height={mvs(220)} />
      ) : (
        <>
          <ProductHeader
            title={product.name}
            filled={likedItems[product.id]}
            onHeartPress={handleHeartClick}
            id={product.id}
            product={product}
            headerTitleVisible={headerTitleVisible}
            productLink={product.productLink}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            <ProductImages images={product?.images || []} />

            <View style={styles.itemContainer}>
              <Bold style={styles.productPrice}>
                <Regular
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    fontWeight: '400',
                    fontSize: mvs(24),
                    color: colors.lightgreen,
                  }}>
                  ${' '}
                </Regular>
                {product.price}
              </Bold>
              <Bold style={styles.productTitle}>{product.name}</Bold>
              {
                <View style={styles.locationContainer}>
                  <MarkerSVG
                    width={mvs(20)}
                    height={mvs(20)}
                    fill={colors.grey}
                  />
                  <Regular style={styles.productLocation}>
                    <Text>Pakistan</Text>
                    {/* {product.location} */}
                  </Regular>
                </View>
              }
            </View>
            <ProductMenu
              color={product.stock}
              condition={product.description}
              material={product.user?.name}
            />
            <View style={styles.descriptionContainer}>
              <Bold style={{fontSize: mvs(22)}}>Description</Bold>
              <Regular style={styles.description}>
                {product.description}
              </Regular>
            </View>
            <ProviderInfo provider={product} />

            <View style={styles.providerContainer}>
              <Row>
                <Regular>Show-ID</Regular>
                <Regular>{product.id}</Regular>
              </Row>
            </View>

            <ShareActions
              productTitle={product.name}
              productLink={product.productLink}
            />
          </ScrollView>
          <ProductFooter loading={addingToCart} onBuyPress={handleBuyPress} />
          {isModalVisible && <AddModal onClose={onClose} />}
        </>
      )}

      <Snackbar
        visible={showAddedSnackbar}
        onDismiss={() => setShowAddedSnackbar(false)}
        duration={3000}
        style={{
          position: 'absolute',
          bottom: mvs(70), // push it above the Buy button
          left: 10,
          right: 10,
          borderRadius: 8,
        }}
        action={{
          label: 'View Cart',
          onPress: () => {
            navigation.navigate('Home', {screen: 'CartScreen'});
          },
        }}>
        Product added to cart!
      </Snackbar>
    </SafeAreaView>
  );
};

export default ProductDetail;
