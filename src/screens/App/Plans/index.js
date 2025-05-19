import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import MainHeader from '../../../components/Headers/MainHeader';
import Regular from '../../../typography/RegularText';
import {SafeAreaView} from 'react-native-safe-area-context';

const PlansScreen = () => {
  const navigation = useNavigation();
  //   const {roleType} = useSelector(state => state.user);
  const [sellertype, setSellertype] = useState('2');

  const handlePlan = () => {
    navigation.navigate('Card');
  };
  return (
    <SafeAreaView>
      <MainHeader title={'Choose Your Plan'} showBackIcon={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{marginVertical: 20, paddingHorizontal: 20}}>
          {/* <TouchableOpacity
          onPress={() => navigation.replace('MainTabs')}
          style={{alignItems: 'flex-end'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.grey}}>
            Skip
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
              {/* <Text style={styles.header}>Choose Your Plan</Text> */}
              <Regular style={styles.subHeader}>
                Find the perfect plan for your selling needs
              </Regular>
            </>
          )}
          <View style={{justifyContent: 'flex-end', flex: 1}}>
            {sellertype == 1 && (
              // {/* Personal Seller Plan */}
              <View style={styles.card}>
                <Text style={styles.planTitle}>Personal Seller</Text>
                <Text style={styles.price}>Free </Text>
                <Text style={styles.details}>
                  🔹 Ad Posting Limit: 2 ads/week
                </Text>
                <Text style={styles.details}>🔹 Ad Expiry: 1 year</Text>
                <Text style={styles.details}>🔹 Ad Visibility: Standard</Text>
                <Text style={styles.details}>
                  🔹 Renewal: Automatic Weekly Reset
                </Text>
                <Text style={styles.details}>
                  🔹 Support: Basic Email Support
                </Text>
                <Text style={styles.target}>
                  Ideal for individuals with occasional selling needs
                </Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Choose Plan</Text>
                </TouchableOpacity>
              </View>
            )}

            {sellertype == 2 && (
              <>
                {/* Company Seller Plans */}
                <View style={styles.card}>
                  <Text style={styles.planTitle}>Starter Plan</Text>
                  <Text style={styles.price}>$5/month</Text>
                  <Text style={styles.details}>
                    🔸 Ad Posting Limit: 2 ads/month
                  </Text>
                  <Text style={styles.details}>🔸 Ad Expiry: 1 year</Text>
                  <Text style={styles.details}>🔸 Ad Visibility: Standard</Text>
                  <Text style={styles.details}>🔸 Analytics: Basic</Text>
                  <Text style={styles.details}>🔸 Support: Email Support</Text>
                  <Text style={styles.details}>🔸 Branding: Not included</Text>
                  <Text style={styles.details}>
                    🔸 Employee Sub-accounts: 1
                  </Text>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.card}>
                <Text style={styles.planTitle}>Business Plan</Text>
                <Text style={styles.price}>$49/month</Text>
                <Text style={styles.details}>
                  🔸 Ad Posting Limit: 100 ads/month
                </Text>
                <Text style={styles.details}>🔸 Ad Expiry: 1 year</Text>
                <Text style={styles.details}>
                  🔸 Ad Visibility: Priority Listing
                </Text>
                <Text style={styles.details}>🔸 Analytics: Advanced</Text>
                <Text style={styles.details}>🔸 Support: Priority Email</Text>
                <Text style={styles.details}>🔸 Branding: Included</Text>
                <Text style={styles.details}>🔸 Employee Sub-accounts: 5</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
              </View> */}

                <View style={styles.card}>
                  <Text style={styles.planTitle}>Premium Plan</Text>
                  <Text style={styles.price}>$15/month</Text>
                  <Text style={styles.details}>
                    🔸 Ad Posting Limit: Unlimited
                  </Text>
                  <Text style={styles.details}>🔸 Ad Expiry: 1 year</Text>
                  <Text style={styles.details}>
                    🔸 Ad Visibility: Top of List + Featured Badge
                  </Text>
                  <Text style={styles.details}>
                    🔸 Analytics: Full Insights & Trends
                  </Text>
                  <Text style={styles.details}>
                    🔸 Support: 24/7 Chat & Email
                  </Text>
                  <Text style={styles.details}>🔸 Branding: Included</Text>
                  <Text style={styles.details}>
                    🔸 Employee Sub-accounts: Unlimited
                  </Text>
                  <TouchableOpacity style={styles.button} onPress={handlePlan}>
                    <Text style={styles.buttonText}>Get Started</Text>
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
