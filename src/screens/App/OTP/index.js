import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { BackSVG } from '../../../assets/svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../util/color';

const OTPScreen = ({ navigation, route }) => {
  // You would typically get the phone number from route params
  const email = route?.params?.phoneNumber || '****@gmail.com';
  
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  
  // Focus first input when screen loads
  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

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

  const handleContinue = () => {
    const verificationCode = code.join('');
    console.log('Verification code submitted:', verificationCode);
    // Handle verification logic here
    // navigation.navigate('NextScreen');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
                  <BackSVG width={33} fill={'white'} height={33} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mobile Verification</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.instruction}>
          Enter the code sent to your phone number
        </Text>
        
        <Text style={styles.phoneNumber}>
          Sent to ({email})
        </Text>
        
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
            !isCodeComplete && styles.continueButtonDisabled
          ]}
          disabled={!isCodeComplete}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor:colors.lightgreen,
    borderRadius:22
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
    gap:20,
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
});

export default OTPScreen;