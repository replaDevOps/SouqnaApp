import React, {useEffect, useRef} from 'react';
import { Image } from 'react-native';
import {Animated, View, StyleSheet} from 'react-native';

export default function Loader({width, height, containerStyle}) {
  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        <Image
          source={require('../assets/img/loader.gif')}
          style={{
            width,
            height,
            opacity: 0.9,
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
