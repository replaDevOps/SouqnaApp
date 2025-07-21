// RecommendedSection.js
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, View, TouchableOpacity, Image, Text} from 'react-native';
import styles from './style';
import Regular from '../../../../typography/RegularText';
import {HeartSvg} from '../../../../assets/svg';
import Bold from '../../../../typography/BoldText';
import {useSelector} from 'react-redux';
import {
  addToFavorite,
  BASE_URL_Product,
  fetchBuyerProducts,
  fetchSellerProducts,
  removeFromFavorite,
} from '../../../../api/apiServices';
import {useTranslation} from 'react-i18next';
import {mvs} from '../../../../util/metrices';
import ProductCardSkeleton from './ProductCardSkeleton';
import {useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../../../redux/slices/snackbarSlice';

const RecommendedSection = () => {
  const hideTitle = false;
  const [apiProducts, setApiProducts] = useState([]);
  console.log('🚀 ~ RecommendedSection ~ apiProducts:', apiProducts);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isEndOfResults, setIsEndOfResults] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  const {token, role} = useSelector(state => state.user);

  const {t} = useTranslation();
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

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);

    const filters = {
      productName: '',
      fromDate: '',
      toDate: '',
      status: '',
    };

    let response = null;

    if (role === 2 || role === '2') {
      // Seller
      response = await fetchSellerProducts(token, filters);
    } else {
      // Buyer or Guest (role 3 or others)
      response = await fetchBuyerProducts(filters);
    }
    if (response?.success && Array.isArray(response.data)) {
      setApiProducts(response.data);
    } else {
      console.error('Invalid products data', response);
    }
    setProductsLoading(false);
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleHeartClick(id, item) {
    if (role === 2) {
      showSnackbar('Log in as buyer');
      return;
    }

    const isInFavorites = item?.isFavorite;
    if (isInFavorites) {
      await removeFromFavorite(id, token).then(res => {
        const updatedState = apiProducts.map(product => {
          if (product.id === id) {
            product.isFavorite = !product.isFavorite;
          }
          return product;
        });
        setApiProducts(updatedState);
      });
    } else {
      await addToFavorite(id, token).then(res => {
        const updatedState = apiProducts.map(product => {
          if (product.id === id) {
            product.isFavorite = !product.isFavorite;
          }
          return product;
        });
        setApiProducts(updatedState);
      });
    }
  }

  async function loadMoreProducts() {
    console.log('Loading more products');
  }

  const renderRecommendedItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.recommendedItem}
        onPress={() =>
          navigation.navigate('ProductDetail', {productId: item.id})
        }>
        <Image
          source={{uri: `${BASE_URL_Product}${item.images?.[0]?.path}`}}
          style={styles.recommendedImage}
        />
        <View style={styles.recommendedTextContainer}>
          <Regular style={styles.recommendedTitle}>{item.name}</Regular>
          <Regular style={styles.recommendedPrice}>
            {' '}
            {getCurrencySymbol(item?.currency)}{' '}
            {Number(item.price).toLocaleString()}
          </Regular>
        </View>
        {role !== 2 && (
          <TouchableOpacity
            onPress={() => handleHeartClick(item.id, item)}
            style={styles.heartIconContainer}>
            <HeartSvg filled={item?.isFavorite} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [handleHeartClick, role],
  );

  // Render skeleton items in the same layout as the actual product items
  const renderSkeletonList = () => {
    // Create an array of 6 dummy items for skeleton
    const skeletonItems = Array(6)
      .fill(null)
      .map((_, index) => ({id: `skeleton-${index}`}));

    return (
      <FlatList
        data={skeletonItems}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={() => <ProductCardSkeleton />}
        contentContainerStyle={{paddingBottom: mvs(10)}}
      />
    );
  };

  return (
    <View style={[styles.recommendedContainer, {flex: 1}]}>
      {!hideTitle && (
        <Bold style={[{marginVertical: mvs(20)}, styles.recommendedText]}>
          {role === 2
            ? t('yourListings')
            : role === 3
            ? t('recommendedForYou')
            : ''}
        </Bold>
      )}
      {/* <Button
        title="Test Deep Link"
        onPress={() =>
          Linking.openURL(
            'myapp://product/ddf69a24-0c13-4185-a639-ec1372ece937',
          )
        }
      /> */}

      {productsLoading ? (
        renderSkeletonList()
      ) : (
        <FlatList
          data={apiProducts}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRecommendedItem}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.2}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          ListFooterComponent={
            isEndOfResults ? (
              <Regular style={styles.endOfResultsText}>
                {t('endOfResults')}
              </Regular>
            ) : null
          }
          ListEmptyComponent={
            !productsLoading && (
              <View style={{paddingVertical: mvs(100)}}>
                <Image
                  source={require('../../../../assets/img/empty.png')}
                  style={{
                    width: '100%',
                    resizeMode: 'contain',
                    height: mvs(200),
                  }}
                />
                <Text style={{textAlign: 'center', marginTop: mvs(20)}}>
                  {t('noProductsFound')}
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

export default RecommendedSection;
