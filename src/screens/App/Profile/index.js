import React, { useCallback, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
import {
  logoutUser,
  setVerificationStatus,
} from '../../../redux/slices/userSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MyButton } from '../../../components/atoms/InputFields/MyButton';
import { ForwardSVG, ProfileSVG, SouqnaLogo } from '../../../assets/svg';
import Regular from '../../../typography/RegularText';
import MainHeader from '../../../components/Headers/MainHeader'; // Import the new component
import VerificationStatus from '../../../components/Structure/VerificationStatus';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileHeader from '../../../components/Headers/ProfileHeader';
import { colors } from '../../../util/color';
import { mvs } from '../../../util/metrices';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { token, verificationStatus } = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVerificationStatus = async () => {
    try {
      const response = await axios.get(
        'https://backend.souqna.net/api/viewVerification',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        const apiStatus = response.data.data.status || response.data.data;
        dispatch(setVerificationStatus(apiStatus));
        console.log('Fetched verification status: ', apiStatus);
      }
    } catch (error) {
      console.error('Verification API error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fetchVerificationStatus();
    setRefreshing(false);
    console.log('Profile Refreshed');
  };

  useFocusEffect(
    useCallback(() => {
      fetchVerificationStatus();
    }, []),
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.replace('Login');
    console.log('Login');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.Scrollcontainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <StatusBar barStyle="dark-content" />
      <ProfileHeader OnPressLogout={handleLogout} />
      <View
        style={styles.container}
      >


        <VerificationStatus />

        <View style={styles.content}>
          <Regular style={styles.regularText}>General</Regular>
          <View style={styles.menuContainer}>

            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>My Account</Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItemContainer}
              onPress={() => {
                navigation.navigate('Verification');
              }}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>
                  <Regular style={styles.menuText}>
                    {verificationStatus === 'verified' ? 'Update Profile' : 'Get Verified'}
                  </Regular>
                </Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItemContainer} onPress={handleChangePassword}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>ChangePassword</Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>My Account</Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>


          </View>

          <Regular style={styles.regularText}>Favourites</Regular>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>My Account</Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>My Account</Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>My Account</Regular>
              </View>
              <ForwardSVG width={30} height={30} fill={colors.green} />
            </TouchableOpacity>
          </View>
        </View>


      </View>
    </ScrollView>
  );
};

export default Profile;
