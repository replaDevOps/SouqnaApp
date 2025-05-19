import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../util/color';

const PlansScreen = () => {
//   const {roleType} = useSelector(state => state.user);
const [sellertype,setSellertype] = useState('2')
  return (
    <ScrollView style={styles.container}>
<View style={{marginVertical: 50,
    paddingHorizontal: 20,alignItems: 'center'}}>
    
        <Image source={require('../../../assets/img/logo1.png')} style={{width:120,height:120,resizeMode:"cover"}}/>
      <Text style={styles.header}>Choose Your Plan</Text>
      <Text style={styles.subHeader}>Find the perfect plan for your selling needs</Text>

      <View style={styles.cardContainer}>
        {
            sellertype == 1 && (

        // {/* Personal Seller Plan */}
        <View style={styles.card}>
          <Text style={styles.planTitle}>Personal Seller</Text>
          <Text style={styles.price}>Free</Text>
          <Text style={styles.details}>🔹 Ad Posting Limit: 2 ads/week</Text>
          <Text style={styles.details}>🔹 Ad Expiry: 1 year</Text>
          <Text style={styles.details}>🔹 Ad Visibility: Standard</Text>
          <Text style={styles.details}>🔹 Renewal: Automatic Weekly Reset</Text>
          <Text style={styles.details}>🔹 Support: Basic Email Support</Text>
          <Text style={styles.target}>Ideal for individuals with occasional selling needs</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Choose Plan</Text>
          </TouchableOpacity>
        </View>
            )
        }

{
            sellertype == 2 && (
                <>
                
        {/* Company Seller Plans */}
        <View style={styles.card}>
          <Text style={styles.planTitle}>Starter Plan</Text>
          <Text style={styles.price}>$19/month</Text>
          <Text style={styles.details}>🔸 Ad Posting Limit: 20 ads/month</Text>
          <Text style={styles.details}>🔸 Ad Expiry: 1 year</Text>
          <Text style={styles.details}>🔸 Ad Visibility: Standard</Text>
          <Text style={styles.details}>🔸 Analytics: Basic</Text>
          <Text style={styles.details}>🔸 Support: Email Support</Text>
          <Text style={styles.details}>🔸 Branding: Not included</Text>
          <Text style={styles.details}>🔸 Employee Sub-accounts: 1</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.planTitle}>Business Plan</Text>
          <Text style={styles.price}>$49/month</Text>
          <Text style={styles.details}>🔸 Ad Posting Limit: 100 ads/month</Text>
          <Text style={styles.details}>🔸 Ad Expiry: 1 year</Text>
          <Text style={styles.details}>🔸 Ad Visibility: Priority Listing</Text>
          <Text style={styles.details}>🔸 Analytics: Advanced</Text>
          <Text style={styles.details}>🔸 Support: Priority Email</Text>
          <Text style={styles.details}>🔸 Branding: Included</Text>
          <Text style={styles.details}>🔸 Employee Sub-accounts: 5</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.planTitle}>Premium Plan</Text>
          <Text style={styles.price}>$99/month</Text>
          <Text style={styles.details}>🔸 Ad Posting Limit: Unlimited</Text>
          <Text style={styles.details}>🔸 Ad Expiry: 1 year</Text>
          <Text style={styles.details}>🔸 Ad Visibility: Top of List + Featured Badge</Text>
          <Text style={styles.details}>🔸 Analytics: Full Insights & Trends</Text>
          <Text style={styles.details}>🔸 Support: 24/7 Chat & Email</Text>
          <Text style={styles.details}>🔸 Branding: Included</Text>
          <Text style={styles.details}>🔸 Employee Sub-accounts: Unlimited</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
        </>
    )}
      </View>
      
</View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    // backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    elevation: 3,
    flex: 1,
    minWidth: '45%',
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 15,
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
  },
  target: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.lightgreen,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default PlansScreen;
