import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Regular from '../../typography/RegularText';
import {HeartSvg} from '../../assets/svg';
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {BASE_URL_Product} from '../../api/apiServices';

const ProductCard = ({product, onPress, onHeartPress}) => {
  const {role} = useSelector(state => state.user);
  const favorites = useSelector(state => state.favorites.favorites);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(product.id)}>
      <Image
        source={{
          uri: `${BASE_URL_Product}${product?.images?.[0]?.path}`,
        }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Regular style={styles.name} numberOfLines={1}>
          {product?.name}
        </Regular>
        <Regular style={styles.price}>
          ${Number(product?.price || 0).toLocaleString()} - USD
        </Regular>
      </View>
      {/* {role !== 2 && (
        <TouchableOpacity
          onPress={() => onHeartPress?.(product.id, product)}
          style={styles.heartIcon}>
          <HeartSvg filled={isLiked} />
        </TouchableOpacity>
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: mvs(10),
    backgroundColor: colors.gray,
    marginBottom: mvs(18),
    marginHorizontal: '1%',
    borderColor: colors.gray,
    borderWidth: 2,
  },
  image: {
    width: '100%',
    height: mvs(120),
    borderTopLeftRadius: mvs(10),
    borderTopRightRadius: mvs(10),
  },
  textContainer: {
    padding: mvs(10),
  },
  name: {
    fontSize: mvs(14),
    marginBottom: mvs(5),
  },
  price: {
    fontSize: mvs(12),
    color: '#888',
  },
  heartIcon: {
    position: 'absolute',
    top: mvs(10),
    right: mvs(10),
    zIndex: 1,
  },
});

export default ProductCard;
