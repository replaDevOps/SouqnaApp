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
import {showSnackbar} from '../../../redux/slices/snackbarSlice';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import { ScrollView } from 'react-native';

// import {setRole} from '../../../redux/slices/userSlice';

const Register = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
const [isSeller, setIsSeller] = useState(true); 
const [isBuyer, setIsBuyer] = useState(true);   
const [selectedOption, setSelectedOption] = useState('Both'); 
  const [profilename, setProfilename] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const profileNameOpacity = useRef(new Animated.Value(0)).current;
  const [sellerType, setSellerType] = useState('');
  // const [snackbarVisible, setSnackbarVisible] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {t} = useTranslation();

  // const showSnackbar = message => {
  //   setSnackbarMessage(message);
  //   setSnackbarVisible(true);
  // };

  const navigation = useNavigation();

  const handleRegister = async () => {
    console.log('Register button pressed');

    if (!profilename.trim()) {
      dispatch(showSnackbar(t('Please enter your name.')));
      console.log('Dispatch:', dispatch);
      // showSnackbar('Please enter your name.');

      return;
    }
    if (!isEmailValid(email)) {
      dispatch(showSnackbar(t('Please enter a valid email.')));
      console.log('Dispatch:', dispatch);
      // showSnackbar('Please enter a valid email.');
      return;
    } else {
      setEmailError('');
    }

    if (!isPasswordValid(password)) {
      dispatch(showSnackbar(t('Password must be at least 8 characters.')));
      console.log('Dispatch:', dispatch);
      // showSnackbar('Password must be at least 8 characters.');
      return;
    } else {
      setPasswordError('');
    }
    // if ((isSeller || (isSeller && isBuyer)) && !sellerType) {
    //   dispatch(showSnackbar(t('Please select a seller type.')));
    //   console.log('Dispatch:', dispatch);
    //   // showSnackbar('Please select a seller type.');
    //   return;
    // }
    // if (!isSeller && !isBuyer) {
    //   dispatch(showSnackbar(t('Please select a role.')));
    //   console.log('Dispatch:', dispatch);
    //   // showSnackbar('Please select a role.');
    //   return;
    // }
    // if (isSeller && sellerType === 'Company' && !cardDetails) {
    //   setShowCardModal(true);
    //   return;
    // }
    const storedFcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('Stored FCM Token: ', storedFcmToken);
    let role = 4;

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
        dispatch(
          showSnackbar(
            t(data.message || 'registrationSuccess'),
          ),
        );
        // showSnackbar(data.message || 'Registration successful! Please login.');
        setTimeout(() => {
          navigation.replace('OTP', {email});
        }, 2000);
      } else {
        dispatch(
          showSnackbar(
            t(data.message || 'registrationFailed'),
          ),
        );
        // showSnackbar(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(
        'Registration Error:',
        error?.response?.data || error.message,
      );
      dispatch(
        showSnackbar(
          t(
            error?.response?.data?.message ||
              'registrationError',
          ),
        ),
      );
      // showSnackbar(
      //   error?.response?.data?.message ||
      //     'An error occurred during registration. Please try again.',
      // );
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
  style={{flex: 1}}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // adjust based on your header
>
  <ScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
  >
        <View style={{padding: 10}}></View>
        <Header
          showBackButton
          onBackPress={() => navigation.goBack()}
          title={t('Help')}
        />
        <View style={styles.HeaderContainer}>
          <Image
            source={require('../../../assets/img/logo1.png')}
            style={{width: mvs(50), height: mvs(50)}}
          />
          <Bold style={styles.title}>Souqna</Bold>
        </View>
        <Bold style={styles.howText}>{t('How do you want to use Souqna?')}</Bold>
        {/* <RadioGroup
          options={[
            {value: 'Seller', label: t('seller')},
            {value: 'Buyer', label: t('buyer')},
            {value: 'Both', label: t('both')},
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
        /> */}
        {(
          <View style={{marginTop: 16}}>
            <RadioGroup
              options={[
                {value: 'Private', label: t('Private')},
                {value: 'Company', label: t('Company')},
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
          placeholder={t('Name')}
        />
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
        <View style={styles.switchContainer}>
          <CustomSwitch
            value={isSubscribed}
            onValueChange={setIsSubscribed}
            trackColor={{false: colors.grey, true: colors.green}}
            thumbColor={isSubscribed ? colors.white : '#f4f3f4'}
          />
          <Regular style={styles.switchText}>
           {t('emailUpdates')}
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
            {t('ourTermsApplyPart1')}{' '}
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.example.com/terms')}>
              <Regular style={styles.termsLink}>{t('ourTermsApplyPart3')}</Regular>
            </TouchableOpacity>{' '}
            {t('ourTermsApplyPart2')}{' '}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://www.example.com/privacy-policy')
              }>
              <Regular style={styles.termsLink}>{t('ourTermsApplyPart4')}</Regular>
            </TouchableOpacity>
            .
          </Regular>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Register;
