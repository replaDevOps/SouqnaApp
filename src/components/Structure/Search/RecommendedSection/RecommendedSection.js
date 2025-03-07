// RecommendedProducts.js
import React from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from './style';
import Regular from '../../../../typography/RegularText';
import {HeartSvg} from '../../../../assets/svg';
import Bold from '../../../../typography/BoldText';

const RecommendedSection = ({
  products,
  loadMoreProducts,
  loading,
  isEndOfResults,
  likedItems,
  handleHeartClick,
  navigateToProductDetails,
}) => {
  const renderRecommendedItem = ({item}) => (
    <TouchableOpacity
      style={styles.recommendedItem}
      onPress={() => navigateToProductDetails(item)}>
      <Image source={item.imageUrl} style={styles.recommendedImage} />
      <View style={styles.recommendedTextContainer}>
        <Regular style={styles.recommendedLocation}>{item.location}</Regular>
        <Regular style={styles.recommendedTitle}>{item.title}</Regular>
        <Regular style={styles.recommendedPrice}>${item.price}</Regular>
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
        data={products}
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
      />
    </View>
  );
};

export default RecommendedSection;
