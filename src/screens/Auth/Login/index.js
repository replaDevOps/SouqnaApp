import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Animated,
  Modal,
  TouchableOpacity,
  Easing,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {setRole, setUser} from '../../../redux/slices/userSlice';
import {EYESVG, SouqnaLogo} from '../../../assets/svg';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {loginUser} from '../../../api/authServices';
import {colors} from '../../../util/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showSnackbar} from '../../../redux/slices/snackbarSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Add animation value
  const slideAnim = useRef(new Animated.Value(1000)).current;

  // Animate modal in when `showRoleModal` is true
  useEffect(() => {
    if (showRoleSelection) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    }
  }, [showRoleSelection]);

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      dispatch(showSnackbar(t('enterValidEmail')));

      // setSnackbarMessage('Please enter a valid email.');
      // setSnackbarVisible(true); // ✅ Show snackbar
      return;
    } else {
      setEmailError('');
    }

    if (!isPasswordValid(password)) {
      dispatch(showSnackbar(t('passwordMinLength')));

      // setSnackbarMessage('Password must be at least 8 characters.');
      // setSnackbarVisible(true); // ✅ Show snackbar
      return;
    } else {
      setPasswordError('');
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);
      if (res.success) {
        const user = res.user;

        // Save actual role first
        dispatch(
          setUser({
            token: user.token,
            refreshToken: user.refreshToken,
            tokenExpire: user.tokenExpire,
            id: user.id,
            name: user.name,
            email: user.email,
            actualRole: user.role, // Save actual role
            role: user.role === 4 ? null : user.role, // Wait for active role selection if both
            password,
            sellerType: user.sellerType,
          }),
        );

        if (user.role === 4) {
          // Show role selection modal if both
          setShowRoleSelection(true);
          dispatch(
            showSnackbar(
              user.role === 3
                ? t('buyerLoginSuccess')
                : t('sellerLoginSuccess'),
            ),
          );
        } else {
          dispatch(
            showSnackbar(
              user.role === 3
                ? t('buyerLoginSuccess')
                : t('sellerLoginSuccess'),
            ),
          );

          // setSnackbarMessage(
          //   user.role === 3
          //     ? 'Buyer logged in successfully'
          //     : 'Seller logged in successfully',
          // );
          // setSnackbarVisible(true);
          setTimeout(() => navigation.replace('MainTabs'));
        }
      } else {
        dispatch(showSnackbar(t('invalidCredentials')));
        // setSnackbarMessage('Invalid email or password');
        // setSnackbarVisible(true); // ✅ Show snackbar
      }
    } catch (error) {
      console.log('Login error:', error);
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = (customMessage = t('invalidCredentials')) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(customMessage, ToastAndroid.SHORT);
    } else {
      Alert.alert('Login Error', customMessage);
    }
  };

  const isEmailValid = email => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = password => {
    return password.length >= 8;
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleClearEmail = () => {
    setEmail('');
  };

  const isFormValid = email && password; // Button activation condition

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{flex: 1}}>
          <StatusBar barStyle="dark-content" />
          <Header title={t('Help')} />

          <View style={styles.HeaderContainer}>
            <SouqnaLogo width={50} height={50} />
            <Bold style={styles.title}>Souqna</Bold>
          </View>

          <PrimaryPasswordInput
            value={email}
            onChangeText={setEmail}
            placeholder={t('E-Mail')}
            error={emailError}
            clearText={handleClearEmail}
          />

          <View style={styles.passwordContainer}>
            <PrimaryPasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder={t('Password')}
              rightIcon={<EYESVG />}
              secureTextEntry={securePassword}
              error={passwordError}
            />
          </View>
          <View style={styles.buttonContainer}>
            <MyButton
              title={
                loading ? (
                  <ActivityIndicator size="large" color={colors.green} />
                ) : (
                  t('Login')
                )
              }
              onPress={handleLogin}
              disabled={loading || !isFormValid}
            />
            <Regular style={styles.registerText}>
              Don’t have an account?{' '}
              <Regular style={styles.registerLink} onPress={navigateToRegister}>
                {t('Register')}
              </Regular>
            </Regular>
          </View>

          {showRoleSelection && (
            <Modal transparent visible={showRoleSelection} animationType="none">
              <View style={styles.modalOverlay}>
                <Animated.View
                  style={[
                    styles.modalContainer,
                    {transform: [{translateY: slideAnim}]},
                  ]}>
                  <Bold style={styles.modalTitle}>Choose Role</Bold>
                  <Regular style={styles.modalText}>
                    Do you want to login as a Buyer or Seller?
                  </Regular>

                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        dispatch(setRole(3)); // Buyer
                        console.log('Role set as 3 (Buyer)');
                        setShowRoleSelection(false);
                        navigation.replace('MainTabs');
                      }}>
                      <Regular style={styles.modalButtonText}>
                        Login as Buyer
                      </Regular>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => {
                        dispatch(setRole(2)); // Seller
                        console.log('Role set as 2 (Seller)');
                        setShowRoleSelection(false);
                        navigation.replace('MainTabs');
                      }}>
                      <Regular style={styles.modalButtonText}>
                        Login as Seller
                      </Regular>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            </Modal>
          )}
        </View>
      </TouchableWithoutFeedback>
      {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        wrapperStyle={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: 'center', // centers the snackbar horizontally
        }}
        style={{
          backgroundColor: colors.lightgreen,
          width: '90%',
          borderRadius: 8,
          left: 30,
        }}>
        <Regular style={{textAlign: 'center'}}>{snackbarMessage}</Regular>
      </Snackbar> */}
    </SafeAreaView>
  );
};

export default LoginScreen;
