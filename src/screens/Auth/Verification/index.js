import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import styles from './styles';
import Regular from '../../../typography/RegularText';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API from '../../../api/apiServices';
import {useSelector} from 'react-redux';

const VerificationScreen = () => {
  const navigation = useNavigation();
  const {token} = useSelector(state => state.user); // Get token from Redux
  const [loading, setLoading] = useState(false); // Add loading state

  const [formData, setFormData] = useState({
    fullName: 'Mubashir Mughal',
    dob: '2001-10-14',
    gender: 'Male',
    country: 'Pakistan',
    address: 'Lalazar',
    idNumber: '37722-8828282-2',
    issueDate: '2019-11-05',
    expDate: '2029-11-05',
  });

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    console.log('Submit button pressed');
    const {
      fullName,
      dob,
      gender,
      country,
      address,
      idNumber,
      issueDate,
      expDate,
    } = formData;

    if (
      !fullName ||
      !dob ||
      !gender ||
      !country ||
      !address ||
      !idNumber ||
      !issueDate ||
      !expDate
    ) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const idFrontSide = null; // Replace with actual image data if available
    const idBackSide = null;
    const selfie = null;

    const data = new FormData();
    data.append('fullName', fullName);
    data.append('dob', dob);
    data.append('gender', gender);
    data.append('country', country);
    data.append('address', address);
    data.append('idNumber', idNumber);
    data.append('issueDate', issueDate);
    data.append('expDate', expDate);

    if (idFrontSide) {
      data.append('idFrontSide', {
        uri: idFrontSide.uri,
        type: idFrontSide.type,
        name: idFrontSide.fileName || '../../../assets/img/driver1.png',
      });
    }

    if (idBackSide) {
      data.append('idBackSide', {
        uri: idBackSide.uri,
        type: idBackSide.type,
        name: idBackSide.fileName || '../../../assets/img/driver1.png',
      });
    }

    if (selfie) {
      data.append('selfie', {
        uri: selfie.uri,
        type: selfie.type,
        name: selfie.fileName || '../../../assets/img/driver1.png',
      });
    }

    try {
      setLoading(true); // Start loading when the request is made
      console.log('Sending FormData:', data);

      const response = await API.post('verification', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response:', response.data);

      if (response.status === 200 && response.data.status !== false) {
        Alert.alert('Success', 'Verification completed!');
        navigation.navigate('Home');
      } else if (response.status === 401) {
        ToastAndroid.show('Message', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', response?.data?.message || 'Verification failed.');
      }
    } catch (error) {
      console.error('Verification Error:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'An error occurred while verifying. Please try again.';

      Alert.alert('Error', message);
    } finally {
      setLoading(false); // Stop loading after the request is completed
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Regular style={styles.headerText}>Verification</Regular>
      </View>

      {[
        {key: 'fullName', placeholder: 'Full Name'},
        {key: 'dob', placeholder: 'Date of Birth'},
        {key: 'gender', placeholder: 'Gender'},
        {key: 'country', placeholder: 'Country'},
        {key: 'address', placeholder: 'Address'},
        {key: 'idNumber', placeholder: 'ID Number'},
        {key: 'issueDate', placeholder: 'Issue Date'},
        {key: 'expDate', placeholder: 'Expiry Date'},
      ].map(({key, placeholder}) => (
        <View key={key} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={formData[key]}
            onChangeText={text => handleInputChange(key, text)}
          />
        </View>
      ))}

      <TouchableOpacity onPress={handleSubmit} disabled={loading}>
        <MyButton title={loading ? 'Submitting...' : 'Submit'} />
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
    </ScrollView>
  );
};

export default VerificationScreen;
