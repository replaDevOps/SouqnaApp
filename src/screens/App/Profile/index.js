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
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {
  BackwardSVG,
  ChangePassSVG,
  ForwardSVG,
  LanguageSVG,
  ProfileSVG,
  VerifiedSVG,
} from '../../../assets/svg';
import Regular from '../../../typography/RegularText';
import VerificationStatus from '../../../components/Structure/VerificationStatus';
import ProfileHeader from '../../../components/Headers/ProfileHeader';
import {colors} from '../../../util/color';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../../api/apiServices';
import ProfileSkeleton from './ProfileSkeleton';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    token,
    verificationStatus,
    role: activeRole,
    actualRole,
  } = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [localStatus, setLocalStatus] = useState(null);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  const isFocused = useIsFocused();
  const fetchVerificationStatus = async () => {
    if (!token) return;
    setVerificationLoading(true);

    try {
      const response = await API.get('viewVerification', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const apiStatus =
          response.data?.data?.status ?? response.data?.data ?? 'unverified';
        dispatch(setVerificationStatus(apiStatus));
        setLocalStatus(apiStatus);

        console.log('Fetched verification status: ', apiStatus);
      } else {
        setLocalStatus(0);
      }
    } catch (error) {
      console.error('Verification API error:', error);
      setLocalStatus(0);
    } finally {
      setVerificationLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (activeRole === '2') {
        fetchVerificationStatus();
      } else {
        // Reset visibility when switching to other roles
        setLocalStatus(null);
      }
    }, [activeRole]),
  );

   // Function to handle role switching
  const handleRoleSwitching = () => {
    setIsRoleSwitching(true);
    setTimeout(() => {
      setIsRoleSwitching(false);
    }, 1500); // Show skeleton for 1.5 seconds
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeRole === '2') {
      await fetchVerificationStatus();
    }
    setRefreshing(false);
    console.log('Profile Refreshed');
  };

  const handleLogout = () => {
    dispatch(logoutUser());

    navigation.replace('Login');
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
      return <BackwardSVG width={24} height={24} stroke={colors.green} />;
    }
    return <ForwardSVG width={24} height={24} fill={colors.green} />;
  };

  

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      contentContainerStyle={styles.Scrollcontainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={50}
        />
      }>
      <View style={{backgroundColor: '#fff', elevation: 0, shadowOpacity: 0}}>
        <ProfileHeader OnPressLogout={handleLogout} onRoleSwitch={handleRoleSwitching}  />
      </View>

      <View style={styles.container}>
        {activeRole === '2' && (
          <VerificationStatus
            status={localStatus}
            // loading={verificationLoading}
          />
        )}
         {
          isRoleSwitching ?(
            <ProfileSkeleton />
          ):
        <View style={styles.content}>
          <Regular style={styles.regularText}>{t('general')}</Regular>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={() => navigation.navigate('MyAccount')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>{t('myAccount')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            {(activeRole === '2' || activeRole === 2) && actualRole === 4 ? (
              <TouchableOpacity
                style={styles.menuItemContainer}
                onPress={() => navigation.navigate('Verification')}>
                <View style={styles.leftRow}>
                  <View style={styles.iconWrapper}>
                    <VerifiedSVG width={22} height={22} />
                  </View>
                  <Regular style={styles.menuText}>
                    {verificationStatus === 'verified'
                      ? t('updateProfile')
                      : t('getVerified')}
                  </Regular>
                </View>
                {renderDirectionalIcon()}
              </TouchableOpacity>
            ) : (
              ''
            )}

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={handleChangePassword}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ChangePassSVG width={22} height={22} />
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
                  <LanguageSVG width={24} height={24} />
                </View>
                <Regular style={styles.menuText}>
                  {i18n.language === 'en'
                    ? t('switchToArabic')
                    : t('switchToEnglish')}
                </Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={() => navigation.navigate('Plans')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ChangePassSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>Subscription Plans</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={() => navigation.navigate('Card')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ChangePassSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>cardPlans</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>
          </View>
        </View>
         }
      </View>
    </ScrollView>
  );
};

export default Profile;
