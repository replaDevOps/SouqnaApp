// RecommendedProducts.js
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import styles from './style';
import Regular from '../../../../typography/RegularText';
import {HeartSvg} from '../../../../assets/svg';
import Bold from '../../../../typography/BoldText';
import {useSelector} from 'react-redux';
import {fetchProducts} from '../../../../api/apiServices';

const RecommendedSection = ({
  products,
  loadMoreProducts,
  loading,
  isEndOfResults,
  likedItems,
  handleHeartClick,
  navigateToProductDetails,
}) => {
  const [apiProducts, setApiProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const {token} = useSelector(state => state.user);

  useEffect(() => {
    const loadProducts = async () => {
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
    };

    loadProducts();
  }, [token]);

  const renderRecommendedItem = ({item}) => (
    <TouchableOpacity
      style={styles.recommendedItem}
      onPress={() => navigateToProductDetails(item.id)}>
      <Image
        source={{uri: `https://backend.souqna.net${item.images[0]?.path}`}}
        style={styles.recommendedImage}
      />
      <View style={styles.recommendedTextContainer}>
        <Regular style={styles.recommendedTitle}>{item.name}</Regular>
        <Regular style={styles.recommendedPrice}>${item.price} - USD</Regular>
      </View>
      <TouchableOpacity
        onPress={() => handleHeartClick(item.id, item)}
        style={styles.heartIconContainer}>
        <HeartSvg filled={likedItems[item.id]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.recommendedContainer}>
      <Bold>Recommended For You</Bold>
      <FlatList
        data={apiProducts}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRecommendedItem}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" />
          ) : isEndOfResults ? (
            <Regular style={styles.endOfResultsText}>End of Results</Regular>
          ) : null
        }
        ListEmptyComponent={
          productsLoading ? <Text>Loading...</Text> : <Text></Text>
        }
      />
    </View>
  );
};

export default RecommendedSection;
