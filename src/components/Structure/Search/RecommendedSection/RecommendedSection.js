// RecommendedProducts.js
import React from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  StatusBar,
} from 'react-native';
import styles from './style';
import Regular from '../../../../typography/RegularText';
import {HeartSvg, MarkerSVG} from '../../../../assets/svg';
import Bold from '../../../../typography/BoldText';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';
// import Icon from 'react-native-vector-icons/FontAwesome5'

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
        <Regular style={styles.recommendedTitle}>{item.title}</Regular>
        <Regular style={styles.recommendedPrice}>${item.price} - USD</Regular>
        <View style={styles.recommendedLocationContainer}>
          <MarkerSVG width={13} height={20} fill={colors.grey} />
          <Regular style={styles.recommendedLocation}>{item.location}</Regular>
        </View>
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
