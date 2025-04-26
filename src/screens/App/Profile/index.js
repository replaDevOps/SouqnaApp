import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import styles from './styles';
import {logoutUser, resetUser} from '../../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {SouqnaLogo} from '../../../assets/svg';
import Regular from '../../../typography/RegularText';
import MainHeader from '../../../components/Headers/MainHeader'; // Import the new component
import VerificationStatus from '../../../components/Structure/VerificationStatus';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const verificationStatus = 0;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.replace('Login');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MainHeader title="My Account" />

      <View style={styles.logoContainer}>
        <SouqnaLogo width={50} height={50} />
        <Regular style={styles.regularText1}>Souqna</Regular>
      </View>

      {/* VerificationStatus component */}
      <VerificationStatus status={verificationStatus} />

      <View style={styles.content}>
        <Regular style={styles.regularText}>Profile</Regular>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Regular style={styles.menuText}>My Account</Regular>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Verification');
            }}>
            <Text style={styles.menuText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Update Pic</Text>
          </TouchableOpacity>
        </View>

        <Regular style={styles.regularText}>Favourites</Regular>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Regular style={styles.menuText}>Favourite Ads</Regular>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Favourite Searches</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Favourite Sellers</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <MyButton title="Change Password" onPress={handleChangePassword} />
      </View>
      <View style={styles.footer}>
        <MyButton title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

export default Profile;
