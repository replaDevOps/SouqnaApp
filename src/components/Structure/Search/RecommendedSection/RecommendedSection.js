// RecommendedSection.js
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
} from 'react-native';
import styles from './style';
import Regular from '../../../../typography/RegularText';
import {HeartSvg} from '../../../../assets/svg';
import Bold from '../../../../typography/BoldText';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';
import {useTranslation} from 'react-i18next';
import {mvs} from '../../../../util/metrices';
import ProductCardSkeleton from './ProductCardSkeleton';

const RecommendedSection = ({
  products,
  loadMoreProducts,
  loading,
  isEndOfResults,
  // likedItems,
  handleHeartClick,
  navigateToProductDetails,
  hideTitle,
  refreshing,
  onRefresh,
}) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const {token, role} = useSelector(state => state.user);
  const favorites = useSelector(state => state.favorites.favorites);

  const likedItemes = useMemo(() => {
    const map = {};
    favorites.forEach(item => {
      map[item.id] = true;
    });
    return map;
  }, [favorites]);

  const {t} = useTranslation();

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);

    const filters = {
      productName: '',
      fromDate: '',
      toDate: '',
      status: '',
    };

    const response = await fetchProducts(token, filters);
    console.log('API Response:', response);
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

  const renderRecommendedItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.recommendedItem}
        onPress={() => navigateToProductDetails(item.id)}>
        <Image
          source={{uri: `https://backend.souqna.net${item.images?.[0]?.path}`}}
          style={styles.recommendedImage}
        />
        <View style={styles.recommendedTextContainer}>
          <Regular style={styles.recommendedTitle}>{item.name}</Regular>
          <Regular style={styles.recommendedPrice}>
            {' '}
            $ {Number(item.price).toLocaleString()} - USD
          </Regular>
        </View>
        {role !== 2 && (
          <TouchableOpacity
            onPress={() => handleHeartClick(item.id, item)}
            style={styles.heartIconContainer}>
            <HeartSvg filled={likedItemes[item.id]} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    ),
    [handleHeartClick, likedItemes, navigateToProductDetails],
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
    <View style={styles.recommendedContainer}>
      {!hideTitle && (
        <Bold style={[{marginBottom: 10}, styles.recommendedText]}>
          {t('recommendedForYou')}
        </Bold>
      )}

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
          refreshControl={
            // 👈 add this
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
                    width: '90%',
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
