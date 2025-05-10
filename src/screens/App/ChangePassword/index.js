import React, {useState} from 'react';
import {View, TextInput,  Text, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setUser} from '../../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import {useTranslation} from 'react-i18next';
import {colors} from '../../../util/color';
import { Image } from 'react-native';
import { mvs } from '../../../util/metrices';
import { BackSVG } from '../../../assets/svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user); // Fetch the current user data
  const [OldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
      <TouchableOpacity 
        style={{
          backgroundColor:colors.lightgreen,
          padding:mvs(4),
          justifyContent:'center',
          alignItems:'center',
          borderRadius:mvs(23),
          width:mvs(40),
          height:mvs(40)
        }}
        onPress={() => navigation.goBack()}>
          <BackSVG width={30} fill={'white'} height={30} />
        </TouchableOpacity>
<View style={styles.inputContainer}>
         <Image source={require('../../../assets/img/logo1.png')} style={styles.logo} />
</View>
        <Text style={styles.title}>Reset Password</Text>
        
        <Text style={styles.label}>Old Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Old Password"
          placeholderTextColor="#CCCCCC"
          keyboardType="OldPassword-address"
          value={OldPassword}
          onChangeText={setOldPassword}
        />
        
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={handleResetPassword}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
</View>
    </SafeAreaView>
  );
};

export default ChangePassword;