import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

export default function Loader({width, height, containerStyle}) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  const loaderWidth = width;
  const loaderHeight = height;

  useEffect(() => {
    // Create continuous spinning animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        isInteraction: false,
      }),
    ).start();

    // Clean up animation when component unmounts
    return () => {
      spinAnim.stopAnimation();
    };
  }, [spinAnim]);

  // Map animation value to rotation degrees
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        <Animated.Image
          source={require('../assets/img/loader.png')}
          style={{
            width: loaderWidth,
            height: loaderHeight,
            transform: [{rotate: spin}],
            opacity: 0.9, // Reduced opacity for the loader image
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.13)', // Semi-transparent gray background
    zIndex: 999, // Ensure it appears above other content
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
