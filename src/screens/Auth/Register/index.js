/* eslint-disable no-shadow */
/* eslint-disable no-alert */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Linking,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './styles';
import {EYESVG, SouqnaLogo} from '../../../assets/svg';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {colors} from '../../../util/color';
import RadioGroup from '../../../components/atoms/InputFields/RadioGroup';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import CustomSwitch from '../../../components/atoms/InputFields/CustomSwitch';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API from '../../../api/apiServices';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [profilename, setProfilename] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const profileNameOpacity = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleRegister = async () => {
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

    if (selectedOption === 'Private' && !profilename) {
      alert('Please provide a profile name for your private account');
      return;
    }

    const payload = {
      name: selectedOption === 'Private' ? profilename : 'Commercial User',
      email,
      password,
      role: selectedOption === 'Private' ? 2 : 3, // 2=Private, 3=Commercial
    };

    try {
      const response = await API.post('register', payload);
      const data = response.data;

      if (data.success) {
        alert(data.message || 'Registration successful! Please login.');
        navigation.navigate('Login');
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(
        'Registration Error:',
        error?.response?.data || error.message,
      );
      alert(
        error?.response?.data?.message ||
          'An error occurred during registration. Please try again.',
      );
    }
  };

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

  useEffect(() => {
    if (selectedOption === 'Private') {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Header
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={'Help'}
      />
      <View style={styles.HeaderContainer}>
        <SouqnaLogo width={50} height={50} />
        <Bold style={styles.title}>Souqna</Bold>
      </View>
      <Bold style={styles.howText}>How do you want to use Souqna?</Bold>

      <RadioGroup
        options={[
          {value: 'Private', label: 'Private'},
          {value: 'Commercial', label: 'Commercial'},
        ]}
        selectedOption={selectedOption}
        onSelect={setSelectedOption}
      />

      {selectedOption === 'Private' && (
        <Animated.View style={{opacity: profileNameOpacity}}>
          <PrimaryPasswordInput
            value={profilename}
            onChangeText={setProfilename}
            placeholder="Profilename"
          />
        </Animated.View>
      )}

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
          Yes, I look forward to receiving regular email updates from the group
          of companies - you can unsubscribe at any time.
        </Regular>
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          title="Register For Free"
          onPress={handleRegister}
          disabled={!email || !password} // Disable button if form is not valid
        />
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
  );
};

export default Register;
