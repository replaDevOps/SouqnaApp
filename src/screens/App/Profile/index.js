import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {resetUser} from '../../../redux/slices/userSlice';
import {useNavigation} from '@react-navigation/native';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import {SouqnaLogo} from '../../../assets/svg';
import Regular from '../../../typography/RegularText';
import MainHeader from '../../../components/Headers/MainHeader';
import api from '../../../api/apiServices';
import {isTokenExpired} from '../../../api/helper';
import {refreshAuthToken} from '../../../api/authProvider';
import {logoutUser} from '../../../redux/slices/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.user); // Get user state
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(resetUser());
    navigation.replace('Login');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword'); // Navigate to ChangePassword screen
  };
  useEffect(() => {
    let token = user.token;
    console.log('Current Token: ', token);
  });

  const handlePrivacy = async () => {
    setLoading(true);

    let token = user.token;
    const refreshToken = user.refreshToken;

    // ✅ Check if token is expired
    if (!token || isTokenExpired(token)) {
      console.log('⚠️ Token expired. Attempting refresh...');
      token = await refreshAuthToken(dispatch, refreshToken);
    }

    if (!token) {
      setLoading(false);
      Alert.alert('Session Expired', 'Please log in again.');
      dispatch(logoutUser());
      return;
    }

    try {
      const response = await api.get('/viewPrivacy', {
        headers: {Authorization: `Bearer ${token}`}, // Attach valid token
      });

      if (response.data.success) {
        Alert.alert('Privacy Policy', response.data.data.description);
      } else {
        Alert.alert('Error', 'Failed to load privacy policy');
      }
    } catch (error) {
      console.error('❌ Privacy fetch error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while fetching privacy policy',
      );
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MainHeader
        title="My Account"
        // No showCloseIcon prop passed, so it will be hidden by default
      />
      <View style={styles.logoContainer}>
        <SouqnaLogo width={50} height={50} />
        <Regular style={styles.regularText1}>Souqna</Regular>
      </View>
      <View style={styles.content}>
        <Regular style={styles.regularText}>Profile</Regular>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Regular style={styles.menuText}>My Account</Regular>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Update Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <Text style={styles.menuText}>
              View Privacy {loading && <ActivityIndicator size="small" />}
            </Text>
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
