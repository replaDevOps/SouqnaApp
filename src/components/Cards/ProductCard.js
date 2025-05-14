import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {BASE_URL} from '../../api/apiServices';
import {colors} from '../../util/color';

const ProductCard = ({product, onPress}) => {
  const imageUrl = product?.images?.[0]?.path
    ? `${BASE_URL}${product.images[0].path}`
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(product)}>
      <Image
        source={
          imageUrl ? {uri: imageUrl} : require('../../assets/img/empty.png')
        }
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: colors.gray,
    borderRadius: 10,
    // elevation: 3,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProductCard;
