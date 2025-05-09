import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {OffSVG, PowerOffSVG, SouqnaLogo} from '../../assets/svg';
import OnSVG from '../../assets/svg/OnSVG';
import {t} from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setRole} from '../../redux/slices/userSlice';
import {Snackbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

const {height} = Dimensions.get('window');
const headerHeight = height * 0.28;

export default function ProfileHeader({OnPressLogout}) {
  const [isSellerOn, setIsSellerOn] = useState(role === '2' || role === 2); // Initialize based on role

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {role} = useSelector(state => state.user);
  const [fadeAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  useEffect(() => {
    setIsSellerOn(role === '2' || role === 2); // Update seller mode on role change
  }, [role]);

  const toggleSellerMode = () => {
    const message = isSellerOn
      ? t('Logged out as seller')
      : t('Logged out as buyer');
    setSnackbarMessage(message);
    setSnackbarVisible(true);

    // Fade-out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Call logout function and navigate to Login screen after animation
    OnPressLogout();

    // setTimeout(() => {
    navigation.replace('Login');
    // }, 1000); // Delay navigation until snackbar fade-out finishes
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={OnPressLogout} style={styles.logoutButton}>
        <PowerOffSVG width={mvs(25)} height={mvs(25)} fill={colors.white} />
      </TouchableOpacity>

      {/* <View style={styles.logoRow}> */}
      <View style={styles.logoWrapper}>
        {/* <SouqnaLogo width={mvs(50)} height={mvs(50)} /> */}
        <Image
          source={require('../../assets/img/logo1.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.sellerContainer}>
        <Text style={styles.sellerText}>{t('Seller Account')}</Text>
        <TouchableOpacity onPress={toggleSellerMode} activeOpacity={0.8}>
          {isSellerOn ? (
            <OnSVG width={mvs(40)} height={mvs(45)} fill={colors.white} />
          ) : (
            <OffSVG width={mvs(40)} height={mvs(45)} fill={colors.gray} />
          )}
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_LONG} // Adjusted duration for better visibility
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.lightorange,
    height: headerHeight,
    paddingTop: mvs(30),
    paddingHorizontal: mvs(15),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: mvs(8),
  },
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    // backgroundColor: '#e1e1e1',
    // borderRadius: mvs(30),
    // width: mvs(60),
    // height: mvs(60),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: mvs(45),
  },
  appTitle: {
    marginLeft: mvs(10),
    fontWeight: 'bold',
    fontSize: mvs(24),
    color: colors.green,
  },
  sellerContainer: {
    backgroundColor: '#ADBD6E',
    flexDirection: 'row',
    paddingHorizontal: mvs(8),
    borderRadius: mvs(10),
    paddingVertical: mvs(0),
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    left: 20,
    right: 20,
  },
  sellerText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: mvs(20),
  },
  logo: {
    width: mvs(100),
    height: mvs(90),
    resizeMode: 'cover',
  },
});
