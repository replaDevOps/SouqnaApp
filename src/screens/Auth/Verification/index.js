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
  StatusBar,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import styles from './styles';
import Regular from '../../../typography/RegularText';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API from '../../../api/apiServices';
import MainHeader from '../../../components/Headers/MainHeader';
import {UploadSVG, CalendarSVG, CalendersSVG} from '../../../assets/svg';
import { colors } from '../../../util/color';
import { mvs } from '../../../util/metrices';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  
  // States for date pickers
  const [openDob, setOpenDob] = useState(false);
  const [openIssueDate, setOpenIssueDate] = useState(false);
  const [openExpDate, setOpenExpDate] = useState(false);

  const handleInputChange = (key, value) => {
    setFormData({...formData, [key]: value});
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle date selection for DOB
  const handleDobChange = (date) => {
    setOpenDob(false);
    const formattedDate = formatDate(date);
    setFormData({...formData, dob: formattedDate});
  };

  // Handle date selection for Issue Date
  const handleIssueDateChange = (date) => {
    setOpenIssueDate(false);
    const formattedDate = formatDate(date);
    setFormData({...formData, issueDate: formattedDate});
  };

  // Handle date selection for Expiry Date
  const handleExpDateChange = (date) => {
    setOpenExpDate(false);
    const formattedDate = formatDate(date);
    setFormData({...formData, expDate: formattedDate});
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

  // Convert string dates to Date objects for pickers
  const parseDateString = (dateString) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate maximum date for DOB (today)
  const maxDobDate = new Date();
  
  // Calculate minimum date for Issue Date (can be in the past)
  const minIssueDate = new Date();
  minIssueDate.setFullYear(minIssueDate.getFullYear() - 20); // Allow up to 20 years in the past for issue date
  
  // Calculate minimum date for Expiry Date (today)
  const minExpDate = new Date();

  const renderDateInput = (key, label, placeholder, openState, setOpenState, onConfirm, maxDate, minDate) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setOpenState(true)}
      >
        <Text style={formData[key] ? styles.dateText : styles.datePlaceholder}>
          {formData[key] || placeholder}
        </Text>
        <View style={styles.calendarIcon}>
          <CalendersSVG height={22} width={22} fill={colors.gray}/>
        </View>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openState}
        date={parseDateString(formData[key])}
        mode="date"
        theme='light'
        dividerColor={colors.lightgreen}
        maximumDate={maxDate}
        minimumDate={minDate}
        onConfirm={onConfirm}
        onCancel={() => setOpenState(false)}
      />
    </View>
  );

  return (
    <SafeAreaView>

    <ScrollView>
      <StatusBar barStyle="light-content" translucent backgroundColor="#fff" />
      
      <MainHeader title={'Verification'} />
      <View style={styles.container}>
        {/* Full Name input (first field) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            value={formData.fullName}
            onChangeText={text => handleInputChange('fullName', text)}
          />
        </View>

        {/* Date of Birth input (second field) */}
        {renderDateInput(
          'dob',
          'Date of Birth',
          'Enter Date of Birth (YYYY-MM-DD)',
          openDob,
          setOpenDob,
          handleDobChange,
          maxDobDate, // Maximum date is today (users can't be born in the future)
          null // No minimum date for DOB
        )}

        {/* Remaining text inputs in the specified order */}
        {['gender', 'country', 'address', 'idNumber'].map(key => {
          const labelMap = {
            gender: 'Gender',
            country: 'Country',
            address: 'Address',
            idNumber: 'ID Number',
          };
          const placeholderMap = {
            gender: 'Enter Gender',
            country: 'Enter Country',
            address: 'Enter Address',
            idNumber: 'Enter ID Number',
          };
          return (
            <View key={key} style={styles.inputContainer}>
              <Text style={styles.label}>{labelMap[key]}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholderMap[key]}
                value={formData[key]}
                onChangeText={text => handleInputChange(key, text)}
              />
            </View>
          );
        })}

        {/* Remaining date inputs */}
        {renderDateInput(
          'issueDate',
          'Issue Date',
          'Enter Issue Date (YYYY-MM-DD)',
          openIssueDate,
          setOpenIssueDate,
          handleIssueDateChange,
          null, // No maximum date for issue date
          minIssueDate // Minimum date is 20 years ago
        )}

        {renderDateInput(
          'expDate',
          'Expiry Date',
          'Enter Expiry Date (YYYY-MM-DD)',
          openExpDate,
          setOpenExpDate,
          handleExpDateChange,
          null, // No maximum date for expiry date
          minExpDate // Minimum date is today (can't expire in the past)
        )}

        <View style={styles.uploadRow}>
          {[
            {label: 'Front of ID', state: idFrontSide, setter: setIdFrontSide},
            {label: 'Back of ID', state: idBackSide, setter: setIdBackSide},
          ].map(({label, state, setter}) => (
            <View key={label} style={styles.uploadBox}>
              <TouchableOpacity
                style={styles.imagePickerTouch}
                onPress={() => pickImage(setter)}>
                {state ? (
                  <Image
                    source={{uri: state.uri}}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.uploadLabelContainer}>
                    <UploadSVG
                      width={16}
                      height={16}
                      style={styles.uploadIcon}
                    />
                    <Text style={styles.uploadLabel}>Upload {label}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {state && (
                <TouchableOpacity
                  onPress={() => setter(null)}
                  style={styles.removeIcon}>
                  <Text style={styles.removeIconText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.selfieContainer}>
          <View style={styles.uploadBox}>
            <TouchableOpacity
              style={styles.imagePickerTouch}
              onPress={() => pickImage(setSelfie)}>
              {selfie ? (
                <Image
                  source={{uri: selfie.uri}}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.uploadLabelContainer}>
                  <UploadSVG width={16} height={16} style={styles.uploadIcon} />
                  <Text style={styles.uploadLabel}>Upload Selfie</Text>
                </View>
              )}
            </TouchableOpacity>

            {selfie && (
              <TouchableOpacity
                onPress={() => setSelfie(null)}
                style={styles.removeIcon}>
                <Text style={styles.removeIconText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

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
     </SafeAreaView>
    
  );
};



export default VerificationScreen;