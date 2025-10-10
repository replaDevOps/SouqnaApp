import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const CategorySkeleton = () => {
  const renderSkeletonCard = (isBig = false) => (
    <View style={isBig ? styles.bigCardSkeleton : styles.smallCardSkeleton}>
      <View style={isBig ? styles.bigIconSkeleton : styles.smallIconSkeleton} />
      <View style={isBig ? styles.bigTextSkeleton : styles.smallTextSkeleton} />
    </View>
  );

  return (
    <View style={styles.categoryContainer}>
      <View style={styles.row}>
        {renderSkeletonCard(true)}
        {renderSkeletonCard(true)}
      </View>

      <View style={styles.row1}>
        {renderSkeletonCard(false)}
        {renderSkeletonCard(false)}
        {renderSkeletonCard(false)}
        {renderSkeletonCard(false)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: mvs(10),
    marginHorizontal: mvs(15),
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(5),
    paddingHorizontal: mvs(2),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(20),
    paddingHorizontal: mvs(2),
  },
  bigCardSkeleton: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '48%',
    height: mvs(190),
    paddingVertical: mvs(10),
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  smallCardSkeleton: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '23%',
    height: mvs(115),
    paddingVertical: mvs(8),
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bigIconSkeleton: {
    width: mvs(120),
    height: mvs(120),
    backgroundColor: colors.lightGrey || '#E0E0E0',
    borderRadius: 10,
  },
  smallIconSkeleton: {
    width: mvs(60),
    height: mvs(60),
    backgroundColor: colors.lightGrey || '#E0E0E0',
    borderRadius: 10,
  },
  bigTextSkeleton: {
    marginTop: mvs(8),
    width: '70%',
    height: mvs(14),
    borderRadius: mvs(4),
    backgroundColor: colors.lightGrey || '#E0E0E0',
  },
  smallTextSkeleton: {
    marginTop: mvs(4),
    width: '70%',
    height: mvs(10),
    borderRadius: mvs(4),
    backgroundColor: colors.lightGrey || '#E0E0E0',
  },
});

export default CategorySkeleton;
