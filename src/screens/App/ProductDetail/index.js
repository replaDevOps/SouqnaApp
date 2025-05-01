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
import {Snackbar} from 'react-native-paper';
import axios from 'axios';
import ProductMenu from '../../../components/Structure/ProductMenu/ProductMenu';
import {colors} from '../../../util/color';
import {MarkerSVG} from '../../../assets/svg';
import ShareActions from '../../../components/Structure/ShareAction/ShareAction';
import ProductImages from './ProductImages';
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
  const navigation = useNavigation();
  console.log('Received PRODUCTID: ', productId);

  const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
  const [showViewCartSnackbar, setShowViewCartSnackbar] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      try {
        let response;

        if (role === 2 && token) {
          // Authenticated request
          console.log('Using authenticated API');
          response = await axios.get(
            `https://backend.souqna.net/api/getProduct/${productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          // Public API fallback
          console.log('Using Public API');
          response = await axios.get(
            `https://backend.souqna.net/api/productDetails/${productId}`,
          );
        }

        if (response.status === 200 && response.data.success !== false) {
          setProduct(response.data.data);
        } else {
          console.error('Failed to fetch product details.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, token, role]);

  console.log(product);

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
  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleBuyPress = () => {
    if (!product) return;

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `https://backend.souqna.net${product.images?.[0]?.path}`, // ✅ correct
        quantity: 1,
      }),
    );

    console.log('Added to cart:', {
      id: product.id,
      name: product.name,
      price: product.price,
      image: `https://backend.souqna.net${product.images?.[0]?.path}`, // ✅ correct
    });
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
        <Text>Loading...</Text>
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
          <ProductFooter
            onChatPress={handleChatPress}
            onBuyPress={handleBuyPress}
          />
          {isModalVisible && <AddModal onClose={onClose} />}
        </>
      )}
      <View style={{position: 'absolute', bottom: mvs(70), left: 0, right: 0}}>
        <Snackbar
          visible={showAddedSnackbar}
          onDismiss={() => {
            setShowAddedSnackbar(false);
          }}
          duration={2000}
          action={{
            label: 'View Cart',
            onPress: () => {
              setShowAddedSnackbar(false);
              navigation.navigate('Home', {screen: 'CartScreen'});
            },
          }}>
          Product added to cart successfully
        </Snackbar>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetail;
