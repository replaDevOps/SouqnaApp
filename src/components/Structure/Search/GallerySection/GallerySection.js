/* eslint-disable react/no-unstable-nested-components */
import React, {memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  BASE_URL_Product,
  fetchBuyerProducts,
  fetchSellerProducts,
} from '../../../../api/apiServices';
import Bold from '../../../../typography/BoldText';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../CustomText';

const {width} = Dimensions.get('window');

// Skeleton Loading Component
const SkeletonPlaceholder = () => {
  // Animation value for the shimmer effect
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  // Start the animation when component mounts
  React.useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ).start();
    };

    startShimmerAnimation();
    return () => shimmerValue.stopAnimation();
  }, [shimmerValue]);

  // Interpolated values for the shimmer effect
  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.4, width * 0.4],
  });

  return (
    <View style={styles.skeletonContainer}>
      {/* Array of 3 skeleton items */}
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.productWrapper}>
          <View style={styles.galleryContainerSkeleton}>
            {/* Image placeholder */}
            <View style={styles.skeletonImageContainer}>
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{translateX}],
                  },
                ]}
              />
            </View>

            {/* Text placeholder */}
            <View style={styles.skeletonTextContainer}>
              <View style={styles.skeletonText}>
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{translateX}],
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const GalleryContainer = ({
  onRefresh,
  refreshing,
  onProductSelect,
  loading,
  products = [],
}) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const {token, role} = useSelector(state => state.user);
  const {t} = useTranslation();

  useEffect(() => {
    const loadProducts = async () => {
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
        const isLoggedIn = Boolean(token);
        response = await fetchBuyerProducts(filters, isLoggedIn);
      }
      console.log('API Response:', response);
      if (response?.success && Array.isArray(response.data)) {
        setApiProducts(response.data);
      } else {
        console.error('Invalid products data', response);
      }
      setProductsLoading(false);
    };

    loadProducts();
  }, [token]);

  const renderProduct = useCallback(
    ({item}) => {
      const productImage = item.images?.[0]?.path
        ? `${BASE_URL_Product}${item.images[0].path}`
        : null;

      return (
        <View style={styles.productWrapper}>
          <TouchableOpacity
            style={styles.galleryContainer}
            onPress={() => onProductSelect(item.id)}>
            <Image source={{uri: productImage}} style={styles.productImage} />
            <View style={{paddingVertical: mvs(15)}}>
              <Bold
                style={styles.productTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name || 'Fall'}
              </Bold>
            </View>
          </TouchableOpacity>
        </View>
      );
    },
    [onProductSelect],
  );
  if (loading) {
    return <SkeletonPlaceholder />;
  }

  return (
    <View style={styles.container}>
      <Bold style={styles.galleryLabel}>{t('gallery')}</Bold>
      <View>
        {productsLoading ? (
          <SkeletonPlaceholder />
        ) : (
          <FlatList
            data={apiProducts}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={renderProduct}
            horizontal={true}
            ItemSeparatorComponent={() => <View style={{width: mvs(4)}} />}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={
              <CustomText style={styles.noProductsText}>
                {t('noProducts')}
              </CustomText>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: mvs(15),
  },
  galleryLabel: {
    fontSize: mvs(16),
    paddingLeft: mvs(12),
    marginTop: mvs(20),
    marginBottom: mvs(20),
    color: '#333',
    paddingHorizontal: mvs(6),
    lineHeight: mvs(16),
  },
  flatListContainer: {
    paddingHorizontal: mvs(10),
    paddingBottom: mvs(10),
  },
  productWrapper: {
    paddingHorizontal: mvs(5),
    marginBottom: mvs(10),
  },
  galleryContainer: {
    width: width * 0.4,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: mvs(10),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  productImage: {
    width: '100%',
    height: mvs(100),
    resizeMode: 'cover',
    borderTopLeftRadius: mvs(10),
    borderTopRightRadius: mvs(10),
  },
  productTitle: {
    fontSize: mvs(14),
    textAlign: 'center',
    paddingHorizontal: mvs(6),
    lineHeight: mvs(16),

    color: colors.black,
    marginRight: 'auto',
    marginBottom: mvs(4),
  },
  noProductsText: {
    fontSize: mvs(16),
    paddingHorizontal: mvs(20),
    paddingVertical: mvs(10),
  },

  // Skeleton styles
  skeletonContainer: {
    flexDirection: 'row',
    paddingHorizontal: mvs(10),
  },
  galleryContainerSkeleton: {
    width: width * 0.4,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderRadius: mvs(10),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden', // Contain shimmer effect
  },
  skeletonImageContainer: {
    width: '100%',
    height: mvs(100),
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: mvs(10),
    borderTopRightRadius: mvs(10),
    overflow: 'hidden',
  },
  skeletonTextContainer: {
    width: '100%',
    paddingVertical: mvs(15),
    alignItems: 'center',
    overflow: 'hidden',
  },
  skeletonText: {
    width: '80%',
    height: mvs(18),
    backgroundColor: '#E0E0E0',
    borderRadius: mvs(4),
    overflow: 'hidden',
  },
  shimmer: {
    width: '200%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default memo(GalleryContainer);
