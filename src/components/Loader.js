import FastImage from 'react-native-fast-image';
import {Animated, View, StyleSheet} from 'react-native';
import { colors } from '../util/color';

export default function Loader({width, height, containerStyle}) {
  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        <FastImage
          source={require('../assets/img/loader.gif')}
          style={{
            width,
            height,
            opacity: 0.9,
          }}
          resizeMode={FastImage.resizeMode.contain}
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
    // backgroundColor: 'rgba(0, 0, 0, 0.13)', // Semi-transparent gray background
    backgroundColor: colors.white,
    zIndex: 999, // Ensure it appears above other content
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
