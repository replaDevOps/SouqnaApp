import React, {useEffect} from 'react';
import {View, Animated} from 'react-native';
import {mvs} from '../../../util/metrices';
import styles from './styles';
import SouqnaLogo1 from '../../../assets/svg/logo-svg';

const SplashScreen = ({navigation}) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.logoContainer}>
      <Animated.View style={{opacity: fadeAnim}}>
        <SouqnaLogo1 width={mvs(200)} height={mvs(200)} />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
