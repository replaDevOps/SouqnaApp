import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  ToastAndroid,
  Platform,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {setUser} from '../../../redux/slices/userSlice';
import {EYESVG, SouqnaLogo, VerifySVG} from '../../../assets/svg';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {loginUser} from '../../../api/authServices';
import {colors} from '../../../util/color';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  // const email = 'jmubashir272@gmail.com';
  // const password = 'admin123@'; // Static password for testing

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email.');
      return;
    } else {
      setEmailError('');
    }

    if (!isPasswordValid(password)) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    } else {
      setPasswordError('');
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password);

      if (res.success) {
        dispatch(
          setUser({
            token: res.user.token,
            refreshToken: res.user.refreshToken,
            tokenExpire: res.user.tokenExpire,
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
          }),
        );

        console.log('Login successful:', res.user);
        navigation.replace('Home');
      } else {
        showErrorMessage();
      }
    } catch (error) {
      console.log('Login error:', error);
      showErrorMessage();
    } finally {
      setLoading(false);
    }
  };

  const showErrorMessage = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Invalid email or password', ToastAndroid.SHORT);
    } else {
      Alert.alert('Login Error', 'Invalid email or password');
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

  const togglePasswordVisibility = () => {
    setSecurePassword(!securePassword);
  };

  const handleClearEmail = () => {
    setEmail('');
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const isFormValid = email && password; // Button activation condition

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Header title={'Help'} />
      <View style={styles.HeaderContainer}>
        <SouqnaLogo width={50} height={50} />
        <Bold style={styles.title}>Souqna</Bold>
      </View>

      <PrimaryPasswordInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-Mail"
        error={emailError}
        clearText={handleClearEmail} // Pass clearText function to clear email input
      />

      <View style={styles.passwordContainer}>
        <PrimaryPasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
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
              'Login'
            )
          }
          onPress={handleLogin}
          disabled={loading || !isFormValid}
        />
        <Regular style={styles.registerText}>
          Don’t have an account?{' '}
          <Regular style={styles.registerLink} onPress={navigateToRegister}>
            Register
          </Regular>
        </Regular>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
