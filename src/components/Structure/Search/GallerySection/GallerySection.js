// components/Structure/Search/GalleryContainer/GalleryContainer.js
import React from 'react';
import {FlatList, View, Image} from 'react-native';
import Regular from '../../../../typography/RegularText';
import styles from '../../../../screens/App/Search/style';
import Bold from '../../../../typography/BoldText';

const GalleryContainer = ({products}) => {
  return (
    <View style={styles.galleryContainer}>
      <Bold>Gallery</Bold>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.productItem}>
            <Image source={item.imageUrl} style={styles.productImage} />
            <Regular style={styles.productTitle}>{item.title}</Regular>
            <Regular style={styles.productPrice}>${item.price}</Regular>
          </View>
        )}
      />
    </View>
  );
};

export default GalleryContainer;
