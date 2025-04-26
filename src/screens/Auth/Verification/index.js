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
  Image,
  Button,
  Modal,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import styles from './styles';
import Regular from '../../../typography/RegularText';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API from '../../../api/apiServices';
import MainHeader from '../../../components/Headers/MainHeader';

const VerificationScreen = () => {
  const navigation = useNavigation();
  const {token} = useSelector(state => state.user);
  console.log(token);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'mubashir mughal',
    dob: '2001-10-14',
    gender: 'male',
    country: 'pakistan',
    address: 'pakistan',
    idNumber: '15604-0376998-3',
    issueDate: '2025-03-21',
    expDate: '2035-03-21',
  });

  const [idFrontSide, setIdFrontSide] = useState(null);
  const [idBackSide, setIdBackSide] = useState(null);
  const [selfie, setSelfie] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  const pickImage = async setter => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Image Picker Error: ' + response.errorMessage);
        } else if (response.assets?.length > 0) {
          const asset = response.assets[0];
          setter({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          });
        }
      },
    );
  };

  const handleSubmit = async () => {
    console.log('Submit button pressed ✅');

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
      !expDate ||
      !idFrontSide ||
      !idBackSide
    ) {
      ToastAndroid.show(
        'Please fill all fields and upload all images.',
        ToastAndroid.SHORT,
      );
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append('idFrontSide', idFrontSide);
    data.append('idBackSide', idBackSide);
    data.append('selfie', selfie);

    try {
      setLoading(true);
      const response = await API.post('verification', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('API Response:', response.data);
      if (response.status === 200 && response.data.success) {
        Alert.alert('Success', 'Verification completed!');
        navigation.navigate('Home');
      } else if (
        !response.data.success &&
        response.data.message === 'Your document is still Pending'
      ) {
        setModalVisible(true); // Open modal if the document is still pending
      } else {
        ToastAndroid.show(
          response?.data?.message || 'Verification failed.',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An error occurred during verification.';
      ToastAndroid.show(message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <MainHeader title={'Verification'} />
      <View style={styles.container}>
        {/* <View style={styles.headerContainer}>

      </View> */}

        {[
          {key: 'fullName', label: 'Full Name', placeholder: 'Enter Full Name'},
          {
            key: 'dob',
            label: 'Date of Birth',
            placeholder: 'Enter Date of Birth (YYYY-MM-DD)',
          },
          {key: 'gender', label: 'Gender', placeholder: 'Enter Gender'},
          {key: 'country', label: 'Country', placeholder: 'Enter Country'},
          {key: 'address', label: 'Address', placeholder: 'Enter Address'},
          {key: 'idNumber', label: 'ID Number', placeholder: 'Enter ID Number'},
          {
            key: 'issueDate',
            label: 'Issue Date',
            placeholder: 'Enter Issue Date (YYYY-MM-DD)',
          },
          {
            key: 'expDate',
            label: 'Expiry Date',
            placeholder: 'Enter Expiry Date (YYYY-MM-DD)',
          },
        ].map(({key, label, placeholder}) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={formData[key]}
              onChangeText={text => handleInputChange(key, text)}
            />
          </View>
        ))}

        {[
          {label: 'Front of ID', state: idFrontSide, setter: setIdFrontSide},
          {label: 'Back of ID', state: idBackSide, setter: setIdBackSide},
          {label: 'Selfie', state: selfie, setter: setSelfie},
        ].map(({label, state, setter}) => (
          <View key={label} style={styles.imagePickerContainer}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
              onPress={() => pickImage(setter)}
              style={styles.uploadButton}>
              <Text style={styles.uploadText}>Upload {label}</Text>
            </TouchableOpacity>

            {state && (
              <View style={styles.previewContainer}>
                <Image source={{uri: state.uri}} style={styles.previewImage} />
                <TouchableOpacity
                  onPress={() => setter(null)} // Removes the image when pressed
                  style={styles.removeButton}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={() => {
            console.log('Button clicked 🔥');
            handleSubmit();
          }}
          disabled={loading}>
          <MyButton title="Submit" onPress={handleSubmit} disabled={loading} />
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Your document is still Pending.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Regular style={styles.modalButtonText}>Close</Regular>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default VerificationScreen;
