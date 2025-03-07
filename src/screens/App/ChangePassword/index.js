import React, {useState} from 'react';
import {View, TextInput, Button, SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import styles from './style';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user); // Fetch the current user data
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      // Update password in Redux
      dispatch(setUser({...user, password: newPassword}));
      alert('Password updated successfully!');
      navigation.goBack();
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <Button title="Change Password" onPress={handleChangePassword} />
    </SafeAreaView>
  );
};

export default ChangePassword;
