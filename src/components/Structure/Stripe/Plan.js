import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import MainHeader from '../../Headers/MainHeader';
import {useNavigation} from '@react-navigation/native';

const PlanScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('basic'); // 'basic' | 'premium'
  const navigation = useNavigation();

  const handleGetPlan = () => {
    Alert.alert(
      'Plan Selected',
      selectedPlan === 'basic'
        ? 'You selected the Basic (Free) plan.'
        : 'You selected the Premium Plan ($20/month with 3-month free trial).',
    );
    navigation.navigate('CardDetailsScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <MainHeader title={'Plan'} /> */}
      <Text style={styles.header}>Choose a Plan</Text>

      {/* <TouchableOpacity
        style={[
          styles.planCard,
          selectedPlan === 'basic' && styles.selectedCard,
        ]}
        onPress={() => setSelectedPlan('basic')}> */}
      {/* <Text style={styles.planTitle}>Basic Plan</Text>
        <Text style={styles.planPrice}>Free</Text>
        <Text style={styles.planPrice}>2 Ads/Week</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={[
          styles.planCard,
          selectedPlan === 'premium' && styles.selectedCard,
        ]}
        onPress={() => setSelectedPlan('premium')}>
        <Text style={styles.planTitle}>Premium Plan</Text>
        <Text style={styles.planPrice}>$20/month</Text>
        <Text style={styles.planPrice}>Unlimited Ads/Week</Text>
        <Text style={styles.trialText}>First 3 months free</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGetPlan} style={styles.getButton}>
        <Text style={styles.getButtonText}>Get Plan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#adbd6e',
    borderWidth: 2,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 16,
    color: '#333',
  },
  trialText: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  getButton: {
    marginTop: 20,
    backgroundColor: '#adbd6e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  getButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
