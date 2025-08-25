import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../redux/slices/userSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../util/color';
import {EYESVG} from '../../../assets/svg';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {resetPassword, ChangePasswords} from '../../../api/apiServices';
import CustomText from '../../../components/CustomText';
// import {Snackbar} from 'react-native-paper';

const ChangePassword = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {resetToken} = route.params || {};
  const dispatch = useDispatch();
  const {token} = useSelector(state => state.user);
  const user = useSelector(state => state.user);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [snackbarVisible, setSnackbarVisible] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState(t('passwordUpdated'));
  const {t} = useTranslation();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('passwordMismatch'));
      return;
    }

    if (!token) {
      try {
        const response = await resetPassword(
          newPassword,
          confirmPassword,
          resetToken,
        );

        if (response?.success) {
          dispatch(setUser({...user, password: newPassword}));
          alert(t('passwordUpdated'));
          navigation.replace('Login');
        } else {
          alert(t('somethingWentWrong'));
        }
      } catch (error) {
        console.error('Change Password Error:', error);
        alert(t('somethingWentWrong'));
      }
    } else {
      try {
        const response = await ChangePasswords(oldPassword, newPassword, token);

        if (response?.success) {
          dispatch(setUser({...user, password: newPassword}));
          alert(t('passwordUpdated'));

          navigation.replace('MainTabs');
        } else {
          alert(t('somethingWentWrong'));
        }
      } catch (error) {
        console.error('Change Password Error:', error);
        alert(t('somethingWentWrong'));
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={t('changePasswordTitle')} showBackIcon={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1, padding: 20}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Image
                  source={require('../../../assets/img/logo1.png')}
                  style={styles.logo}
                />
              </View>
              <CustomText style={styles.title}>{t('resetPassword')}</CustomText>
              {token && (
                <>
                  <CustomText style={styles.label}>
                    {t('oldPasswordLabel')}
                  </CustomText>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder={t('enterOldPasswordPlaceholder')}
                      placeholderTextColor="#CCCCCC"
                      secureTextEntry={!showOldPassword}
                      value={oldPassword}
                      onChangeText={setOldPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowOldPassword(!showOldPassword)}>
                      <EYESVG />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <CustomText style={styles.label}>
                {t('newPasswordLabel')}
              </CustomText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('enterNewPasswordPlaceholder')}
                  placeholderTextColor="#CCCCCC"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}>
                  <EYESVG />
                </TouchableOpacity>
              </View>

              <CustomText style={styles.label}>
                {t('confirmPasswordLabel')}
              </CustomText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t('confirmNewPasswordPlaceholder')}
                  placeholderTextColor="#CCCCCC"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <EYESVG />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}>
                <CustomText style={styles.resetButtonText}>
                  {t('resetButton')}
                </CustomText>
              </TouchableOpacity>
            </View>
            {/* <Snackbar
              visible={snackbarVisible}
              onDismiss={() => setSnackbarVisible(false)}
              duration={2000}>
              {snackbarMessage}
            </Snackbar> */}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// These styles position the eye icon correctly inside the text input field
const eyeStyles = {
  eyeButton: {
    // position: 'absolute',
    // right: 15,
    // top: 0,
    // bottom: 0,
    // justifyContent: 'center',
    // alignItems: 'center',
    // zIndex: 1,
  },
};

export default ChangePassword;
