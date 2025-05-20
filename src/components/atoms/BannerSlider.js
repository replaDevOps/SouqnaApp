// components/BannerSlider.js

import React, {useState} from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const {width} = Dimensions.get('window');

const BannerSlider = () => {
  const [banners, setBanners] = useState([
    {id: 1, image: require('../../assets/img/banner.png')},
    {id: 2, image: require('../../assets/img/banner1.png')},
  ]);

  return (
    <View style={bannerStyles.carouselContainer}>
      <Carousel
        loop
        width={width}
        height={180}
        autoPlay
        data={banners}
        scrollAnimationDuration={1500}
        autoPlayInterval={4000}
        renderItem={({item}) => (
          <Image
            key={item.id}
            source={item.image}
            resizeMode="cover"
            style={bannerStyles.bannerImage}
          />
        )}
      />
    </View>
  );
};

const bannerStyles = StyleSheet.create({
  carouselContainer: {
    width,
    height: 180,
    marginVertical: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    marginTop: 10,
    // borderRadius: 12, // uncomment if needed
  },
});

export default BannerSlider;
