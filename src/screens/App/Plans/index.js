import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import MainHeader from '../../../components/Headers/MainHeader';
import Regular from '../../../typography/RegularText';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const PlansScreen = () => {
  const navigation = useNavigation();
  //   const {roleType} = useSelector(state => state.user);
  const [sellertype, setSellertype] = useState('2');
    const {t} = useTranslation();

  const handlePlan = () => {
    navigation.navigate('Card');
  };
  return (
    <SafeAreaView>
      <MainHeader title={t('choosePlan')} showBackIcon={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{marginVertical: 20, paddingHorizontal: 20}}>
          {/* <TouchableOpacity
          onPress={() => navigation.replace('MainTabs')}
          style={{alignItems: 'flex-end'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.grey}}>
            {t('Skip')}
          </Text>
        </TouchableOpacity> */}
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/img/logo1.png')}
              style={{width: 120, height: 120, resizeMode: 'cover'}}
            />
          </View>
          {sellertype == 2 && (
            <>
              {/* <Text style={styles.header}>{t('choosePlan')}</Text> */}
              <Regular style={styles.subHeader}>
               {t('findPerfectPlan')}
              </Regular>
            </>
          )}
          <View style={{justifyContent: 'flex-end', flex: 1}}>
            {sellertype == 1 && (
              // {/* Personal Seller Plan */}
              <View style={styles.card}>
                <Text style={styles.planTitle}>{t('personalSeller')}</Text>
                <Text style={styles.price}>{t('free')}</Text>
                <Text style={styles.details}>
                   {t('adPostingLimit2Week')}
                </Text>
                <Text style={styles.details}> {t('adExpiryOneYear')}</Text>
                <Text style={styles.details}> {t('adVisibilityStandard')}</Text>
                <Text style={styles.details}>
                   {t('renewalAutomatic')}
                </Text>
                <Text style={styles.details}>
                   {t('supportBasicEmail')}
                </Text>
                <Text style={styles.target}>
                  {t('idealForIndividuals')}
                </Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{t('choosePlanButton')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {sellertype == 2 && (
              <>
                {/* Company Seller Plans */}
                <View style={styles.card}>
                  <Text style={styles.planTitle}>{t('starterPlan')}</Text>
                  <Text style={styles.price}>{t('fiveDollarsMonth')}</Text>
                  <Text style={styles.details}>
                     {t('adPostingLimit2Month')}
                  </Text>
                  <Text style={styles.details}> {t('adExpiryOneYear')}</Text>
                  <Text style={styles.details}> {t('adVisibilityStandard')}</Text>
                  <Text style={styles.details}> {t('analyticsBasic')}</Text>
                  <Text style={styles.details}> {t('supportEmail')}</Text>
                  <Text style={styles.details}> {t('brandingNotIncluded')}</Text>
                  <Text style={styles.details}>
                     {t('employeeSubaccountsOne')}
                  </Text>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{t('getStarted')}</Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.card}>
                <Text style={styles.planTitle}>{t('Business Plan')}</Text>
                <Text style={styles.price}>{t('$49/month')}</Text>
                <Text style={styles.details}>
                   {t('Ad Posting Limit: 100 ads/month')}
                </Text>
                <Text style={styles.details}> {t('Ad Expiry: 1 year')}</Text>
                <Text style={styles.details}>
                   {t('Ad Visibility: Priority Listing')}
                </Text>
                <Text style={styles.details}> {t('Analytics: Advanced')}</Text>
                <Text style={styles.details}> {t('Support: Priority Email')}</Text>
                <Text style={styles.details}> {t('Branding: Included')}</Text>
                <Text style={styles.details}> {t('Employee Sub-accounts: 5')}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>{t('Get Started')}</Text>
                </TouchableOpacity>
              </View> */}

                <View style={styles.card}>
                  <Text style={styles.planTitle}>{t('premiumPlan')}</Text>
                  <Text style={styles.price}>{t('fifteenDollarsMonth')}</Text>
                  <Text style={styles.details}>
                     {t('adPostingUnlimited')}
                  </Text>
                  <Text style={styles.details}> {t('adExpiryOneYear')}</Text>
                  <Text style={styles.details}>
                     {t('adVisibilityTopFeatured')}
                  </Text>
                  <Text style={styles.details}>
                     {t('analyticsFullInsights')}
                  </Text>
                  <Text style={styles.details}>
                     {t('support24x7')}
                  </Text>
                  <Text style={styles.details}> {t('brandingIncluded')}</Text>
                  <Text style={styles.details}>
                     {t('employeeSubaccountsUnlimited')}
                  </Text>
                  <TouchableOpacity style={styles.button} onPress={handlePlan}>
                    <Text style={styles.buttonText}>{t('getStarted')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlansScreen;
