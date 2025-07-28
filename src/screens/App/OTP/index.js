import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../util/color';
import MainHeader from '../../../components/Headers/MainHeader';
import {resendOtp, verifyOtp} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const OTPScreen = ({navigation}) => {
  const route = useRoute();
  const {email, resetPassword} = route.params || {}; // safely get the email param
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const {t} = useTranslation();
  // New state for showing resend loading
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };
  const user = useSelector(state => state.user);

  // Focus first input when screen loads
  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);
  // Enable resend button after 10 seconds on mount
  useEffect(() => {
    let interval;
    if (!resendEnabled) {
      setCountdown(60);
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendEnabled]);

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const result = await resendOtp(email);

      if (result?.success) {
        showSnackbar('OTP resent successfully.');
      } else {
        showSnackbar(result?.message || 'Failed to resend OTP.');
      }
      setResendEnabled(false);
      setTimeout(() => setResendEnabled(true), 60000);
    } catch (error) {
      showSnackbar('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCodeChange = (text, index) => {
    // Only accept single digit inputs
    if (text.length > 1) {
      text = text.charAt(0);
    }

    // Update the code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input if current input is filled
    if (text.length === 1 && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // If backspace and current field is empty, go back to previous field
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleContinue = async () => {
    const verificationCode = code.join('');
    console.log('Verification code submitted:', verificationCode);

    if (!verificationCode || verificationCode.length !== 4) {
      showSnackbar('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true); // Show loader

    try {
      const response = await verifyOtp(verificationCode);

      if (response?.success) {
        showSnackbar(response.message || 'OTP verified successfully.');

        if (resetPassword) {
          navigation.navigate('ChangePassword', {resetToken: response.token});
        } else {
          navigation.replace('Login');
        }
      } else {
        console.warn('OTP verification failed:', response?.error);
        showSnackbar(response?.error || 'Invalid OTP, please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showSnackbar(
        error?.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

        <MainHeader title={t('emailVerification')} showBackIcon={true} />
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}>
            <Image
              source={require('../../../assets/img/logo1.png')}
              style={{height: 50, width: 50}}
            />
          </View>
          <Text style={styles.instruction}>{t('enterCodeSent')}</Text>

          <Text style={styles.phoneNumber}>
            {t('sentTo')} ({email})
          </Text>

          <View style={[styles.codeContainer, styles.ltrContainer]}>
            {code.map((digit, index) => (
              <View key={index} style={styles.codeBoxWrapper}>
                <TextInput
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[styles.codeBox, styles.ltrInput]}
                  value={digit}
                  onChangeText={text => handleCodeChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isCodeComplete && styles.continueButtonDisabled,
            ]}
            disabled={!isCodeComplete}
            onPress={handleContinue}>
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>{t('continue')}</Text>
            )}
          </TouchableOpacity>

          {/* Resend Code Button */}
          <TouchableOpacity
            disabled={!resendEnabled || resendLoading}
            onPress={handleResendCode}
            style={[
              styles.resendButton,
              (!resendEnabled || resendLoading) && styles.resendButtonDisabled,
            ]}>
            {resendLoading ? (
              <ActivityIndicator size="small" color={colors.lightgreen} />
            ) : (
              <Text
                style={[
                  styles.resendButtonText,
                  !resendEnabled && {color: 'gray'},
                ]}>
                {t('resendCode')}
                {!resendEnabled ? ` (${countdown} ${t('sec')})` : ''}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: t('Close'),
            onPress: () => setSnackbarVisible(false),
          }}
          style={{backgroundColor: '#333'}}>
          {snackbarMessage}
        </Snackbar>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  backButton: {
    padding: 5,
    backgroundColor: colors.lightgreen,
    borderRadius: 22,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: colors.lightgreen,
    marginRight: 30, // To account for the back button and center the title
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  phoneNumber: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  codeBoxWrapper: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightgreen,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  codeBox: {
    width: '100%',
    height: '100%',
    fontSize: 24,
    textAlign: 'center',
    color: colors.black,
  },
  continueButton: {
    backgroundColor: colors.lightgreen,
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.lightgreen,
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  resendButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: colors.lightgreen,
    fontWeight: '600',
    fontSize: 16,
  },
  ltrContainer: {
    direction: 'ltr',
    writingDirection: 'ltr',
  },
  ltrInput: {
    textAlign: 'center',
    writingDirection: 'ltr',
  },
});

export default OTPScreen;
