import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Image } from 'react-native';
import { mvs } from '../util/metrices';

export default function Loader() {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 500, // 1 rotation per second
        useNativeDriver: true,
        isInteraction: false,
      })
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/img/loader.png')} // <-- your tire image path
        style={[styles.tire, { transform: [{ rotate: spin }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  tire: {
    width: mvs(200),
    height: mvs(200),
  },
});
