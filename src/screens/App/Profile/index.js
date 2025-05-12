/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  I18nManager,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {
  logoutUser,
  setVerificationStatus,
} from '../../../redux/slices/userSlice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BackwardSVG, ForwardSVG, ProfileSVG} from '../../../assets/svg';
import Regular from '../../../typography/RegularText';
import VerificationStatus from '../../../components/Structure/VerificationStatus';
import axios from 'axios';
import ProfileHeader from '../../../components/Headers/ProfileHeader';
import {colors} from '../../../util/color';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {token, verificationStatus, role} = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVerificationStatus = async () => {
    if (!token) return;

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
        const apiStatus =
          response.data?.data?.status ?? response.data?.data ?? 'unverified';
        dispatch(setVerificationStatus(apiStatus));
        console.log('Fetched verification status: ', apiStatus);
      }
    } catch (error) {
      console.error('Verification API error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (role === 2) {
      await fetchVerificationStatus();
    }
    setRefreshing(false);
    console.log('Profile Refreshed');
  };

  useFocusEffect(
    useCallback(() => {
      if (role === 2) {
        fetchVerificationStatus();
      }
    }, [role]),
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.replace('Login');
    console.log('Login');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const {t, i18n} = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    const isArabic = newLang === 'ar';

    try {
      await AsyncStorage.setItem('appLanguage', newLang); // Save selected language

      const shouldForceRTL = I18nManager.isRTL !== isArabic;

      if (shouldForceRTL) {
        I18nManager.allowRTL(isArabic);
        I18nManager.forceRTL(isArabic);
      }

      i18n.changeLanguage(newLang).then(() => {
        Alert.alert(
          isArabic ? 'تم التغيير' : 'Language Changed',
          isArabic
            ? 'سيتم إعادة تشغيل التطبيق لتطبيق اللغة العربية.'
            : 'App will reload to apply English language.',
          [
            {
              text: isArabic ? 'موافق' : 'OK',
              onPress: () => RNRestart.restart(),
            },
          ],
        );
      });
    } catch (error) {
      console.error('Language toggle error:', error);
    }
  };

  const renderDirectionalIcon = () => {
    if (I18nManager.isRTL) {
      return <BackwardSVG width={20} height={20} fill={colors.green} />;
    }
    return <ForwardSVG width={30} height={30} fill={colors.green} />;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.Scrollcontainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={50}
        />
      }>
      <View />
      <ProfileHeader OnPressLogout={handleLogout} />
      <View style={styles.container}>
        {role === 2 && <VerificationStatus />}

        <View style={styles.content}>
          <Regular style={styles.regularText}>{t('general')}</Regular>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={() => navigation.navigate('MyAccount')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>{t('myAccount')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={() => navigation.navigate('Verification')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>
                  {verificationStatus === 'verified'
                    ? t('updateProfile')
                    : t('getVerified')}
                </Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={handleChangePassword}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>{t('changePassword')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={toggleLanguage}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>
                  {i18n.language === 'en'
                    ? t('switchToArabic')
                    : t('switchToEnglish')}
                </Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>
          </View>
          <Regular style={styles.regularText}>{t('favourites')}</Regular>

          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>{t('myAccount')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>{t('myAccount')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemContainer}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} fill={colors.green} />
                </View>
                <Regular style={styles.menuText}>{t('myAccount')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
