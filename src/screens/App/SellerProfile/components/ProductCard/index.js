/* eslint-disable react-native/no-inline-styles */
import {View, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {HeartSvg} from '../../../../../assets/svg';
import {BASE_URL} from '../../../../../api/apiServices';
import CustomText from '../../../../../components/CustomText';
import SkeletonView from '../../../../../components/SkeletonView';

export const ProductCard = ({
  product,
  isLoading,
  baseImageUrl,
  onHeartClick,
  userRole,
  isLoggedIn,
}) => {
  const {i18n} = useTranslation();
  const isArabic = i18n.language === 'ar';
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View style={styles.productCard}>
        <SkeletonView width="100%" height={160} style={{borderRadius: 12}} />
        <View style={styles.productInfo}>
          <SkeletonView width="80%" height={16} />
          <SkeletonView width="60%" height={14} style={{marginTop: 8}} />
          <SkeletonView width="40%" height={18} style={{marginTop: 8}} />
        </View>
      </View>
    );
  }

  const getProductName = () => {
    return isArabic && product.ar_name ? product.ar_name : product.name;
  };

  const getProductLocation = () => {
    return isArabic && product.ar_location
      ? product.ar_location
      : product.location;
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatPrice = (price, currency) => {
    const formattedPrice = new Intl.NumberFormat().format(price);
    return `${formattedPrice} ${currency || 'USD'}`;
  };

  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return `${BASE_URL}${product.images[0].path}`;
    }
    return 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=No+Image';
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        navigation.navigate('ProductDetail', {productId: product.id})
      }>
      <View style={styles.productImageContainer}>
        <Image source={{uri: getImageUrl()}} style={styles.productImage} />

        {/* Heart/Favorite Button - Only show for logged-in buyers (role !== 2) */}
        {userRole !== 2 && userRole !== '2' && Boolean(isLoggedIn) && (
          <TouchableOpacity
            onPress={() => onHeartClick(product.id, product)}
            style={styles.heartIconContainer}>
            <HeartSvg filled={product?.isFavorite} />
          </TouchableOpacity>
        )}

        {/* {product.negotiable === 'Yes' && (
          <View style={styles.negotiableBadge}>
            <CustomText style={styles.negotiableText}>
              {t('negotiable')}
            </CustomText>
          </View>
        )} */}
      </View>
      <View style={styles.productInfo}>
        <CustomText style={styles.productTitle} numberOfLines={2}>
          {getProductName()}
        </CustomText>
        <CustomText style={styles.productPrice}>
          {formatPrice(product.price, product.currency)}
        </CustomText>
        <View style={styles.productDetails}>
          <CustomText style={styles.productLocation} numberOfLines={1}>
            📍 {getProductLocation()}
          </CustomText>
          <CustomText style={styles.productDate}>
            {formatDate(product.date)}
          </CustomText>
        </View>
        {product.category && (
          <CustomText style={styles.productCategory}>
            {isArabic && product.category.ar_name
              ? product.category.ar_name
              : product.category.name}
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );
};
