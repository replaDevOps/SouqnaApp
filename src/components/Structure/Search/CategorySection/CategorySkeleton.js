import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { mvs } from '../../../../util/metrices';
import { colors } from '../../../../util/color';

const CategorySkeleton = () => {
  // Create an array of 6 items for skeleton placeholders
  const skeletonItems = Array(6).fill({});

  const renderSkeletonItem = () => (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonIcon} />
      <View style={styles.skeletonText} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={skeletonItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `skeleton-${index}`}
        renderItem={renderSkeletonItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: mvs(10),
    marginHorizontal: mvs(5),
    flexDirection: 'row',
  },
  skeletonItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: mvs(70),
  },
  skeletonIcon: {
    width: mvs(55),
    height: mvs(55),
    borderRadius: mvs(27),
    backgroundColor: colors.lightGrey || '#E0E0E0',
  },
  skeletonText: {
    marginTop: mvs(8),
    width: mvs(50),
    height: mvs(12),
    borderRadius: mvs(4),
    backgroundColor: colors.lightGrey || '#E0E0E0',
  },
});

export default CategorySkeleton;