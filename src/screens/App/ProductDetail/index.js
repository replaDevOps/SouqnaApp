/* eslint-disable react-native/no-inline-styles */
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
import {
  addToCart,
  BASE_URL_Product,
  getProduct,
} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import Loader from '../../../components/Loader';
import {addItem} from '../../../redux/slices/cartSlice';
import {getOrCreateConversation} from '../../../firebase/chatService';

const {height} = Dimensions.get('window');

const ProductDetail = () => {
  const [likedItems, setLikedItems] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [headerTitleVisible, setHeaderTitleVisible] = useState(false); // Track header title visibility
  const dispatch = useDispatch();
  const {
    token,
    role,
    verificationStatus,
    id: userId,
  } = useSelector(state => state.user);
  const route = useRoute();
  const {productId} = route.params;
  const [chatLoading, setChatLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showAddedSnackbar, setShowAddedSnackbar] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReadMore, setIsReadMore] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProductDetails = async () => {
      // console.log('Fetching product details using API Service...');
      setLoading(true);
      try {
        const response = await getProduct(
          productId,
          token,
          role,
          verificationStatus,
        );
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
  }, [productId, token, role, verificationStatus, dispatch]);

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

  const handleChatPress = async () => {
    if (!product || !product.seller || !userId) {
      console.error('Missing required data for chat');
      return;
    }

    setChatLoading(true);
    try {
      const sellerId = product.seller.id;
      const sellerName = product.seller.name;

      console.log(
        `Creating/getting conversation between ${userId} and seller ${sellerId}`,
      );

      const conversation = await getOrCreateConversation(
        userId,
        sellerId,
        token,
      );

      if (conversation) {
        // Navigate to the Chat screen with the necessary parameters
        navigation.navigate('Chat', {
          conversationId: conversation.id,
          otherUserId: sellerId,
          userName: sellerName || 'Seller',
          productInfo: {
            id: product.id,
            name: product.name,
            price: product.price,
            image:
              product.images && product.images.length > 0
                ? `${BASE_URL_Product}${product.images[0].path}`
                : null,
          },
        });
        console.log(
          'Successfully navigated to chat with conversation ID:',
          conversation.id,
        );
      } else {
        console.error('Failed to create conversation');
      }
    } catch (error) {
      console.error('Failed to initiate chat:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleBuyPress = async () => {
    if (!product) return;

    setAddingToCart(true);

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `${BASE_URL_Product}${product.images?.[0]?.path}`,
        quantity: 1,
        stock: product.stock,
      }),
    );
    console.log('Added to Redux:', {
      id: product.id,
      name: product.name,
      price: product.price,
      image: `${BASE_URL_Product}${product.images?.[0]?.path}`,
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
        <Loader width={mvs(160)} height={mvs(160)} />
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
            contentContainerStyle={
              role !== '2' || role == null ? {paddingBottom: mvs(80)} : null
            }
            onScroll={onScroll}
            scrollEventThrottle={16}>
            <ProductImages images={product?.images || []} />

            <View style={styles.itemContainer}>
              <Bold style={styles.productPrice}>
                $ {Number(product.price).toLocaleString()}
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
                    <Text>{product.location}</Text>
                    {/* {product.location} */}
                  </Regular>
                </View>
              }
            </View>
            <ProductMenu
              color={product.stock}
              condition={
                product.discounts && Object.keys(product.discounts).length > 0
                  ? JSON.stringify(product.discounts) // or format as needed
                  : 'No Discount'
              }
              material={
                product.condition === 2
                  ? 'Used'
                  : product.condition === 1
                  ? 'New'
                  : ''
              }
            />
            <View style={styles.descriptionContainer}>
              <Bold style={{fontSize: mvs(22)}}>Description</Bold>
              <Regular
                style={styles.description}
                numberOfLines={isReadMore ? 3 : 0}>
                {product.description}
              </Regular>
              {product.description?.split(' ').length > 20 && (
                <Text
                  style={{
                    color: colors.primary,
                    marginTop: 4,
                    marginRight: 10,
                    textAlign: 'right',
                  }}
                  onPress={() => setIsReadMore(!isReadMore)}>
                  {isReadMore ? 'Read More' : 'Show Less'}
                </Text>
              )}
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
              productId={product.id}
            />
          </ScrollView>
          {(role !== '2' || role === null) && (
            <ProductFooter
              loadingBuy={addingToCart}
              loadingChat={chatLoading}
              onBuyPress={handleBuyPress}
              onChatPress={handleChatPress}
              sellerPhone="971501234567"
            />
          )}

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
            navigation.navigate('MainTabs', {screen: 'CartScreen'});
          },
        }}>
        Product added to cart!
      </Snackbar>
    </SafeAreaView>
  );
};

export default ProductDetail;
