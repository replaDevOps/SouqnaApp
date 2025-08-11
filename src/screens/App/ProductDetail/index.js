/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
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
import {colors} from '../../../util/color';
import {MarkerSVG} from '../../../assets/svg';
import ShareActions from '../../../components/Structure/ShareAction/ShareAction';
import ProductImages from './ProductImages';
import {
  addToCart,
  BASE_URL_Product,
  deleteProduct,
  getProduct,
} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import Loader from '../../../components/Loader';
import {addItem} from '../../../redux/slices/cartSlice';
import {getOrCreateConversation} from '../../../firebase/chatService';
import DetailsTable from '../../../components/Structure/Details/DetailsTable';
import LocationMapModal from '../../../components/Modals/LocationMapModal';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';

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
    phoneNo,
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
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLocationModal, setLocationModal] = useState(false);
  const {t} = useTranslation();

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

  const getCurrencySymbol = (currency = 'USD') => {
    switch (currency?.toUpperCase?.()) {
      case 'TRY':
        return '₺';
      case 'USD':
        return '$';
      case 'SYP':
        return '£';
      default:
        return '$';
    }
  };
  const getCurrencyFlag = (currency = 'USD') => {
    switch (currency?.toUpperCase?.()) {
      case 'TRY':
        return '🇹🇷';
      case 'USD':
        return '🇺🇸';
      case 'SYP':
        return '🇸🇾';
      default:
        return '🇺🇸';
    }
  };

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
    // Check if user is not logged in
    if (!token) {
      setIsModalVisible(true);
      return;
    }

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

  const handleUpdatePress = () => {
    navigation.navigate('UpdateProduct', {
      id: product.subCategoryID,
      categoryId: product.categoryID,
      name: product.sub_category?.name,
      category: product.category.name,
      categoryImage: `${BASE_URL_Product}${product.category?.image}`,
      productId: product.id, // required for update API
      productName: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      discount: product.discount,
      specialOffer: product.specialOffer,
      images: product.images, // array of existing image URLs
      location: product.location,
      lat: product.lat,
      long: product.long,
      condition: product.condition, // assuming it's 1 or 2
      custom_fields: product.custom_fields,
      currency: product.currency,
      contactInfo: product.contactInfo,
    });
  };

  const handleDeletePress = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this Ad?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await deleteProduct(productId, token);
            if (response.success) {
              setSnackbarMessage('Ad deleted successfully.');
              setSnackbarVisible(true);
              navigation.replace('MainTabs');
            } else {
              console.warn('Failed to delete Ad:', response.message);
              setSnackbarMessage(response.message || 'Failed to delete Ad.');
              setSnackbarVisible(true);
            }
          } catch (error) {
            console.error('Error deleting Ad:', error.message || error);
            setSnackbarMessage('An error occurred while deleting the Ad.');
            setSnackbarVisible(true);
          }
        },
      },
    ]);
  };

  const onScroll = event => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY > height * 0.25) {
      setHeaderTitleVisible(true);
    } else {
      setHeaderTitleVisible(false);
    }
  };

  const handleLocationPress = () => {
    setLocationModal(true);
  };

  // console.log('{product latitude}',product.lat);
  // console.log('{product longitude}',product.long);

  return (
    <SafeAreaView style={styles.container}>
      {loading || !product ? (
        <Loader width={mvs(250)} height={mvs(250)} />
      ) : (
        <>
          {console.log('Product currency:', product.currency)}
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
            contentContainerStyle={{
              paddingBottom: mvs(80),
              backgroundColor: '#fff',
            }}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            <ProductImages images={product?.images || []} />

            <View style={styles.itemContainer}>
              <Bold style={styles.productPrice}>
                {/* {getCurrencyFlag(product?.currency)} */}
                {getCurrencySymbol(product?.currency)}{' '}
                {Number(product.price).toLocaleString()}
              </Bold>
              <Bold style={styles.productTitle}>{product.name}</Bold>
              {
                <View style={styles.locationContainer}>
                  <MarkerSVG
                    width={mvs(20)}
                    height={mvs(20)}
                    fill={colors.red1}
                  />
                  {/* <Regular style={styles.productLocation}>
                    <Regular>{product.location}</Regular>
                    {/* {product.location} */}
                  {/* </Regular> */}
                  <TouchableOpacity
                    style={styles.productLocation}
                    onPress={() => handleLocationPress()}
                    //                onPress={()=>
                    // console.log('{modal triggered sucessfully}')}
                  >
                    <CustomText
                      style={{color: 'blue', textDecorationLine: 'underline'}}>
                      {t('viewOnMap')}
                    </CustomText>
                    {/* {product.location} */}
                  </TouchableOpacity>
                </View>
              }
            </View>
            {/* <ProductMenu
              color={product.stock}
              condition={
                product.discounts && Object.keys(product.discounts).length > 0
                ? JSON.stringify(product.discounts) // or format as needed
                  : t('No Discount')
              }
              material={
                product.condition === 2
                ? t('Used')
                : product.condition === 1
                ? t('New')
                : ''
              }
              /> */}
            <View style={{}}>
              <Bold
                style={{
                  fontSize: mvs(22),
                  marginHorizontal: mvs(10),
                  fontFamily: 'Asal',
                }}>
                {t('details')}
              </Bold>
              <DetailsTable ProductData={product.custom_fields} />
            </View>
            <View style={styles.descriptionContainer}>
              <Bold style={{fontSize: mvs(22), fontFamily: 'Asal'}}>
                {t('Description')}
              </Bold>
              <Regular
                style={{...styles.description, fontFamily: 'Asal'}}
                numberOfLines={isReadMore ? 3 : 0}>
                {product.description}
              </Regular>
              {product.description?.split(' ').length > 20 && (
                <CustomText
                  style={{
                    color: '#000',
                    marginTop: 4,
                    marginRight: 10,
                    textAlign: 'right',
                  }}
                  onPress={() => setIsReadMore(!isReadMore)}>
                  {isReadMore ? t('readMore') : t('showLess')}
                </CustomText>
              )}
            </View>

            <ProviderInfo provider={product} />

            <View style={styles.providerContainer}>
              <Row>
                <Regular>{t('showId')}</Regular>
                <Regular>{product.id}</Regular>
              </Row>
            </View>

            <ShareActions
              productTitle={product.name}
              productLink={product.productLink}
              productId={product.id}
            />
          </ScrollView>
          {/* {role !== 2 && role !== 4 && token == null && ( */}
          <ProductFooter
            loadingBuy={addingToCart}
            loadingChat={chatLoading}
            onBuyPress={handleBuyPress}
            onChatPress={handleChatPress}
            handleUpdatePress={handleUpdatePress}
            handleDeletePress={handleDeletePress}
            sellerPhone={product.contactInfo}
            productOwnerId={product.seller?.id}
            // customProductLink={customProductLink}
          />

          {isModalVisible && <AddModal onClose={onClose} />}
          {isLocationModal && (
            <LocationMapModal
              visible={isLocationModal}
              onClose={() => setLocationModal(false)}
              latitude={product.lat}
              longitude={product.long}
              title={t('productLocation')}
            />
          )}
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
          label: t('viewCart'),
          onPress: () => {
            navigation.navigate('MainTabs', {screen: 'CartScreen'});
          },
        }}>
        {t('productAddedToCart')}
      </Snackbar>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default ProductDetail;
