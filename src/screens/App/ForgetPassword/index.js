import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {SouqnaLogo} from '../../../assets/svg';
import PrimaryPasswordInput from '../../../components/atoms/InputFields/PrimaryPasswordInput';
import Bold from '../../../typography/BoldText';
import Header from '../../../components/Headers/Header';
import {colors} from '../../../util/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../../Auth/Login/styles';
import {useTranslation} from 'react-i18next';
import {mvs} from '../../../util/metrices';
import {useNavigation} from '@react-navigation/native';
import {ConfirmEmail} from '../../../api/apiServices';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setloading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const {t} = useTranslation();

  const navigation = useNavigation();
  const handleSubmit = async () => {
    if (!email) {
      setEmailError(t('Please enter your email'));
      return;
    }

    setloading(true);
    try {
      const result = await ConfirmEmail(email);

      if (result?.success) {
        navigation.navigate('OTP', {email, resetPassword: true});
      } else {
        setEmailError(result?.message || t('Please check your email'));
      }
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          t('Failed to send confirmation email'),
      );
      setEmailError(t('Failed to send confirmation email'));
    } finally {
      setloading(false);
    }
  };

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
          <View>
            <Text style={{fontSize: mvs(16), fontWeight: 'bold'}}></Text>
            <PrimaryPasswordInput
              value={email}
              onChangeText={setEmail}
              placeholder={t('ConfirmEmailAddress')}
              //error={emailError}
              clearText={() => setEmail('')}
            />
            <Text>{emailError}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <MyButton
              title={
                loading ? (
                  <ActivityIndicator size="large" color={colors.green} />
                ) : (
                  t('Submit')
                )
              }
              onPress={handleSubmit}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgetPassword;
