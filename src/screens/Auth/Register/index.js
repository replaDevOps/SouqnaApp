/* eslint-disable no-shadow */
/* eslint-disable no-alert */
//Register.js
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Linking,
  Animated,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
// import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {EYESVG} from '../../../assets/svg';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {colors} from '../../../util/color';
import RadioGroup from '../../../components/atoms/InputFields/RadioGroup';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import CustomSwitch from '../../../components/atoms/InputFields/CustomSwitch';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API from '../../../api/apiServices';
import {mvs} from '../../../util/metrices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Snackbar} from 'react-native-paper';

// import {setRole} from '../../../redux/slices/userSlice';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [profilename, setProfilename] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const profileNameOpacity = useRef(new Animated.Value(0)).current;
  const [sellerType, setSellerType] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleRegister = async () => {
    console.log('Register button pressed');

    if (!profilename.trim()) {
      showSnackbar('Please enter your name.');

      return;
    }
    if (!isEmailValid(email)) {
      showSnackbar('Please enter a valid email.');
      return;
    } else {
      setEmailError('');
    }

    if (!isPasswordValid(password)) {
      showSnackbar('Password must be at least 8 characters.');
      return;
    } else {
      setPasswordError('');
    }
    if ((isSeller || (isSeller && isBuyer)) && !sellerType) {
      showSnackbar('Please select a seller type.');
      return;
    }
    if (!isSeller && !isBuyer) {
      showSnackbar('Please select a role.');
      return;
    }
    // if (isSeller && sellerType === 'Company' && !cardDetails) {
    //   setShowCardModal(true);
    //   return;
    // }
    const storedFcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('Stored FCM Token: ', storedFcmToken);
    let role = 0;
    if (isSeller && isBuyer) {
      role = 4;
    } else if (isSeller) {
      role = 2;
    } else if (isBuyer) {
      role = 3;
    }

    const payload = {
      name: profilename.trim(),
      email,
      password,
      role,
      fcm: storedFcmToken,
      ...(isSeller && {
        sellerType: sellerType === 'Company' ? 1 : 2,
      }),
    };

    console.log('Payload: ', payload); // Log the payload being sent to the API
    setIsLoading(true);
    try {
      const response = await API.post('register', payload);
      console.log('API Response:', response.data);

      const data = response.data;

      // Ensure that you're only treating this as success if `data.success === true`
      if (data?.success === true) {
        showSnackbar(data.message || 'Registration successful! Please login.');
        setTimeout(() => {
          navigation.replace('OTP', {email});
        }, 2000);
      } else {
        showSnackbar(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(
        'Registration Error:',
        error?.response?.data || error.message,
      );
      showSnackbar(
        error?.response?.data?.message ||
          'An error occurred during registration. Please try again.',
      );
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const isEmailValid = email => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const isValid = emailRegex.test(email);
    console.log('Email validation result: ', isValid, email); // Add a console log here
    return isValid;
  };

  const isPasswordValid = password => {
    const isValid = password.length >= 8;
    console.log('Password validation result: ', isValid, password); // Add a console log here
    return isValid;
  };

  const handleClearEmail = () => {
    setEmail('');
  };

  useEffect(() => {
    if (selectedOption === 'Seller') {
      Animated.timing(profileNameOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(profileNameOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [profileNameOpacity, selectedOption]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Header
          showBackButton
          onBackPress={() => navigation.goBack()}
          title={'Help'}
        />
        <View style={styles.HeaderContainer}>
          <Image
            source={require('../../../assets/img/logo1.png')}
            style={{width: mvs(50), height: mvs(50)}}
          />
          <Bold style={styles.title}>Souqna</Bold>
        </View>
        <Bold style={styles.howText}>How do you want to use Souqna?</Bold>
        <RadioGroup
          options={[
            {value: 'Seller', label: 'Seller'},
            {value: 'Buyer', label: 'Buyer'},
            {value: 'Both', label: 'Both'},
          ]}
          selectedOption={
            isSeller && isBuyer
              ? 'Both'
              : isSeller
              ? 'Seller'
              : isBuyer
              ? 'Buyer'
              : ''
          }
          onSelect={value => {
            console.log('Selected Role:', value);
            if (value === 'Seller') {
              setIsSeller(true);
              setIsBuyer(false);
            } else if (value === 'Buyer') {
              setIsBuyer(true);
              setIsSeller(false);
            } else if (value === 'Both') {
              setIsSeller(true);
              setIsBuyer(true);
            }
          }}
        />
        {isSeller && (
          <View style={{marginTop: 16}}>
            <RadioGroup
              options={[
                {value: 'Private', label: 'Private'},
                {value: 'Company', label: 'Company'},
              ]}
              selectedOption={sellerType}
              onSelect={value => {
                console.log('Selected seller type:', value);
                setSellerType(value);
              }}
            />
          </View>
        )}

        <PrimaryPasswordInput
          value={profilename}
          onChangeText={setProfilename}
          placeholder="Name"
        />
        <PrimaryPasswordInput
          value={email}
          onChangeText={setEmail}
          placeholder="E-Mail"
          error={emailError}
          clearText={handleClearEmail}
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
        <View style={styles.switchContainer}>
          <CustomSwitch
            value={isSubscribed}
            onValueChange={setIsSubscribed}
            trackColor={{false: colors.grey, true: colors.green}}
            thumbColor={isSubscribed ? colors.white : '#f4f3f4'}
          />
          <Regular style={styles.switchText}>
            Yes, I look forward to receiving regular email updates from the
            group of companies - you can unsubscribe at any time.
          </Regular>
        </View>
        <View style={styles.buttonContainer}>
          <MyButton
            title={isLoading ? '' : 'Register For Free'}
            onPress={handleRegister}
            disabled={isLoading || !email || !password}
            style={{justifyContent: 'center', alignItems: 'center'}} // optional
          >
            {isLoading && <ActivityIndicator color={colors.green} />}
          </MyButton>

          <Regular style={styles.termsText}>
            Our{' '}
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.example.com/terms')}>
              <Regular style={styles.termsLink}>Terms of Use</Regular>
            </TouchableOpacity>{' '}
            apply. You can find information about the processing of your data in
            our{' '}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.example.com/privacy-policy')
              }>
              <Regular style={styles.termsLink}>Privacy Policy</Regular>
            </TouchableOpacity>
            .
          </Regular>
        </View>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{position: 'absolute', bottom: Platform.OS === 'ios' ? 30 : 30}}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

export default Register;
