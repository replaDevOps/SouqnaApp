import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import MainHeader from '../../../components/Headers/MainHeader';
import Regular from '../../../typography/RegularText';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';

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
          <CustomText style={{fontSize: 18, fontWeight: 'bold', color: colors.grey}}>
            {t('Skip')}
          </CustomText>
        </TouchableOpacity> */}
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../assets/img/logo1.png')}
              style={{width: 120, height: 120, resizeMode: 'cover'}}
            />
          </View>
          {sellertype == 2 && (
            <>
              {/* <CustomText style={styles.header}>{t('choosePlan')}</CustomText> */}
              <Regular style={styles.subHeader}>{t('findPerfectPlan')}</Regular>
            </>
          )}
          <View style={{justifyContent: 'flex-end', flex: 1}}>
            {sellertype == 1 && (
              // {/* Personal Seller Plan */}
              <View style={styles.card}>
                <CustomText style={styles.planTitle}>
                  {t('personalSeller')}
                </CustomText>
                <CustomText style={styles.price}>{t('free')}</CustomText>
                <CustomText style={styles.details}>
                  {t('adPostingLimit2Week')}
                </CustomText>
                <CustomText style={styles.details}>
                  {' '}
                  {t('adExpiryOneYear')}
                </CustomText>
                <CustomText style={styles.details}>
                  {' '}
                  {t('adVisibilityStandard')}
                </CustomText>
                <CustomText style={styles.details}>
                  {t('renewalAutomatic')}
                </CustomText>
                <CustomText style={styles.details}>
                  {t('supportBasicEmail')}
                </CustomText>
                <CustomText style={styles.target}>
                  {t('idealForIndividuals')}
                </CustomText>
                <TouchableOpacity style={styles.button}>
                  <CustomText style={styles.buttonText}>
                    {t('choosePlanButton')}
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}

            {sellertype == 2 && (
              <>
                {/* Company Seller Plans */}
                <View style={styles.card}>
                  <CustomText style={styles.planTitle}>
                    {t('starterPlan')}
                  </CustomText>
                  <CustomText style={styles.price}>
                    {t('fiveDollarsMonth')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('adPostingLimit2Month')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('adExpiryOneYear')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('adVisibilityStandard')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('analyticsBasic')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('supportEmail')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('brandingNotIncluded')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('employeeSubaccountsOne')}
                  </CustomText>
                  <TouchableOpacity style={styles.button}>
                    <CustomText style={styles.buttonText}>
                      {t('getStarted')}
                    </CustomText>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.card}>
                <CustomText style={styles.planTitle}>{t('Business Plan')}</CustomText>
                <CustomText style={styles.price}>{t('$49/month')}</CustomText>
                <CustomText style={styles.details}>
                   {t('Ad Posting Limit: 100 ads/month')}
                </CustomText>
                <CustomText style={styles.details}> {t('Ad Expiry: 1 year')}</CustomText>
                <CustomText style={styles.details}>
                   {t('Ad Visibility: Priority Listing')}
                </CustomText>
                <CustomText style={styles.details}> {t('Analytics: Advanced')}</CustomText>
                <CustomText style={styles.details}> {t('Support: Priority Email')}</CustomText>
                <CustomText style={styles.details}> {t('Branding: Included')}</CustomText>
                <CustomText style={styles.details}> {t('Employee Sub-accounts: 5')}</CustomText>
                <TouchableOpacity style={styles.button}>
                  <CustomText style={styles.buttonText}>{t('Get Started')}</CustomText>
                </TouchableOpacity>
              </View> */}

                <View style={styles.card}>
                  <CustomText style={styles.planTitle}>
                    {t('premiumPlan')}
                  </CustomText>
                  <CustomText style={styles.price}>
                    {t('fifteenDollarsMonth')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('adPostingUnlimited')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('adExpiryOneYear')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('adVisibilityTopFeatured')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('analyticsFullInsights')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('support24x7')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {' '}
                    {t('brandingIncluded')}
                  </CustomText>
                  <CustomText style={styles.details}>
                    {t('employeeSubaccountsUnlimited')}
                  </CustomText>
                  <TouchableOpacity style={styles.button} onPress={handlePlan}>
                    <CustomText style={styles.buttonText}>
                      {t('getStarted')}
                    </CustomText>
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
