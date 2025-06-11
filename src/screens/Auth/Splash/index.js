import React, {useEffect} from 'react';
import {View, Animated, Image} from 'react-native';
import {mvs} from '../../../util/metrices';
import styles from './styles';

const SplashScreen = ({navigation}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.logoContainer}>
      <Animated.View style={{opacity: fadeAnim}}>
        <Image
          source={require('../../../assets/img/logo1.png')}
          style={{width: mvs(280), height: mvs(200)}}
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
