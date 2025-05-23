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
} from 'react-native';
import {SouqnaLogo} from '../../../assets/svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../util/color';
import MainHeader from '../../../components/Headers/MainHeader';
import Bold from '../../../typography/BoldText';
import {verifyOtp} from '../../../api/apiServices';
import {Snackbar} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';

const OTPScreen = ({navigation}) => {
  const route = useRoute();
  const {email} = route.params || {}; // safely get the email param
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  // New state for enabling resend
  const [resendEnabled, setResendEnabled] = useState(false);
  // New state for showing resend loading
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

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
    const timer = setTimeout(() => {
      setResendEnabled(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);
  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      // Example API call or function to resend OTP, adapt as per your api
      // Here you might want to call some resendOtp(email) function
      // For demo, just wait 1.5s and show a snackbar:
      await new Promise(resolve => setTimeout(resolve, 1500));

      showSnackbar('OTP resent successfully.');
      setResendEnabled(false); // disable button again after resend

      // Restart the 10 second timer to enable again
      setTimeout(() => setResendEnabled(true), 10000);
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
    setLoading(true); // show loader
    try {
      const response = await verifyOtp(verificationCode);

      if (response.success) {
        console.log('OTP Verified:', response);
        showSnackbar(response.message || 'OTP verified successfully.');
        navigation.replace('Login'); // Replace with your actual screen
      } else {
        console.warn('OTP verification failed:', response.error);
        showSnackbar(response.error || 'Invalid OTP, please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      showSnackbar('Something went wrong. Please try again.');
    } finally {
      setLoading(false); // hide loader
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

        <MainHeader title={'Email Verification'} showBackIcon={true} />
        <View style={styles.content}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}>
            <SouqnaLogo width={50} height={50} />
            16
            <Bold style={styles.title}>Souqna</Bold>
          </View>
          <Text style={styles.instruction}>
            Enter the code sent to your email
          </Text>

          <Text style={styles.phoneNumber}>Sent to ({email})</Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <View key={index} style={styles.codeBoxWrapper}>
                <TextInput
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={styles.codeBox}
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
              <Text style={styles.continueButtonText}>Continue</Text>
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
                Resend Code
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: 'Close',
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
});

export default OTPScreen;
