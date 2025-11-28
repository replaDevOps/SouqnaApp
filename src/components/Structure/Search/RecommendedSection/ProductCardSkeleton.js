// ProductCardSkeleton.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { mvs } from '../../../../util/metrices';
import { colors } from '../../../../util/color';

const { width } = Dimensions.get('window');
const imageWidth = width * 0.4;

const ProductCardSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: mvs(8),
        marginBottom: mvs(13),
        backgroundColor: colors.white,
        borderRadius: mvs(10),
        width: imageWidth,
        // elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        overflow: 'hidden',
      }}
    >
      {/* Image Placeholder */}
      <Animated.View
        style={{
          width: '100%',
          height: mvs(130),
          backgroundColor: colors.lightGray || '#F0F0F0',
          borderTopLeftRadius: mvs(10),
          borderTopRightRadius: mvs(10),
          opacity: fadeAnim,
        }}
      />

      {/* Text Container */}
      <View
        style={{
          flexDirection: 'column',
          paddingVertical: mvs(6),
          paddingHorizontal: mvs(6),
        }}
      >
        {/* Title Placeholder */}
        <Animated.View
          style={{
            height: mvs(15),
            width: '85%',
            backgroundColor: colors.lightGray || '#F0F0F0',
            borderRadius: mvs(4),
            opacity: fadeAnim,
            marginBottom: mvs(8),
          }}
        />

        {/* Price Placeholder */}
        <Animated.View
          style={{
            height: mvs(15),
            width: '60%',
            backgroundColor: colors.lightGray || '#F0F0F0',
            borderRadius: mvs(4),
            opacity: fadeAnim,
            marginTop: mvs(4),
          }}
        />
      </View>

      {/* Heart Icon Placeholder */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 7,
          right: 7,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: mvs(20),
          width: mvs(25),
          height: mvs(25),
          opacity: fadeAnim,
        }}
      />
    </View>
  );
};

export default ProductCardSkeleton;