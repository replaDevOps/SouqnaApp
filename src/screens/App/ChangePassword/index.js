import React, {useState} from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../util/color';
import {EYESVG} from '../../../assets/svg';
import MainHeader from '../../../components/Headers/MainHeader';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user); // Fetch the current user data
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleResetPassword = () => {
    if (newPassword === confirmPassword) {
      // Update password in Redux
      dispatch(setUser({...user, password: newPassword}));
      alert(t('passwordUpdated'));
      navigation.goBack();
    } else {
      alert(t('passwordMismatch'));
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={'Change Password'} showBackIcon={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
              <Text style={styles.title}>Reset Password</Text>

              <Text style={styles.label}>Old Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Old Password"
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

              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
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

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
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
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
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
