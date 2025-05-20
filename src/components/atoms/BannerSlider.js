// components/BannerSlider.js

import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Dimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const {width} = Dimensions.get('window');

const BannerSlider = () => {
  const [banners, setBanners] = useState([
    {id: 1, image: require('../../assets/img/banner.png')},
    {id: 2, image: require('../../assets/img/banner1.png')},
  ]);

  return (
    <View style={{width, height: 180, marginVertical: 10}}>
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
            style={{
              width: '100%',
              height: '100%',
              marginTop: 10,
              //   borderRadius: 12,
            }}
          />
        )}
      />
    </View>
  );
};

export default BannerSlider;
