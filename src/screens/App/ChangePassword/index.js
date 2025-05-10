/* eslint-disable no-alert */
import React, {useState} from 'react';
import {View, TextInput, Button, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import {useTranslation} from 'react-i18next';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user); // Fetch the current user data
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      // Update password in Redux
      dispatch(setUser({...user, password: newPassword}));
      alert(t('success'), t('passwordUpdated'));
      navigation.goBack();
    } else {
      alert(t('error'), t('passwordMismatch'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('enterNewPassword')}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder={t('confirmNewPassword')}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <Button title={t('changePassword')} onPress={handleChangePassword} />
    </SafeAreaView>
  );
};

export default ChangePassword;
