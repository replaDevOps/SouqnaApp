import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {setUser} from '../../../redux/slices/userSlice';
import {EYESVG, SouqnaLogo} from '../../../assets/svg';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import api from '../../../api/apiServices';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const isEmailValid = email => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = password => {
    return password.length >= 8;
  };

  const handleClearEmail = () => {
    setEmail('');
  };

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email.');
      return;
    }
    if (!isPasswordValid(password)) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      console.log('Logging in with:', email, password);

      const response = await api.post('/login', {email, password});
      console.log('Login Response:', response.data);

      if (response.data.status) {
        const userData = response.data.user;
        dispatch(
          setUser({
            token: userData.token,
            refreshToken: userData.refreshToken,
            email: userData.email,
            id: userData.id,
            profileName: userData.name,
          }),
        );

        navigation.navigate('Home');
      } else {
        Alert.alert(
          'Login failed',
          response.data.message || 'Invalid credentials',
        );
      }
    } catch (error) {
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };
  const isFormValid = email && password;

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
          title="Login"
          onPress={handleLogin}
          disabled={!isFormValid}
          loading={loading}
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
