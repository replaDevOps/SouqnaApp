import React, {useEffect, useState} from 'react';
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
  Modal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import styles from './styles';
import Regular from '../../../typography/RegularText';
import {MyButton} from '../../../components/atoms/InputFields/MyButton';
import API, {BASE_URL} from '../../../api/apiServices';
import MainHeader from '../../../components/Headers/MainHeader';
import {UploadSVG, CalendersSVG} from '../../../assets/svg';
import {colors} from '../../../util/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';

// Radio Button Component
const RadioButton = ({selected, onPress, label}) => {
  return (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.radioContainer}>
        <View style={styles.radioOuter}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const VerificationScreen = () => {
  const navigation = useNavigation();
  const {token} = useSelector(state => state.user);
  // console.log(token);
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'male', // Default gender value
    country: '',
    address: '',
    idNumber: '',
    issueDate: '',
    expDate: '',
    documentType: '',
  });

  const [idFrontSide, setIdFrontSide] = useState(null);
  const [idBackSide, setIdBackSide] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  // States for date pickers
  const [openDob, setOpenDob] = useState(false);
  const [openIssueDate, setOpenIssueDate] = useState(false);
  const [openExpDate, setOpenExpDate] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [idType, setIdType] = useState('cnic'); // 'idCard' or 'drivingLicense'
  // Dropdown state
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([
    {
      label: '🇹🇷    Turkey',
      value: 'Turkey',
    },
    {
      label: '🇸🇾    Syria',
      value: 'Syria',
    },
  ]);

  //At first view if user has added verification
  useEffect(() => {
    const fetchVerification = async () => {
      try {
        const res = await API.get('viewVerification', {
          headers: {Authorization: `Bearer ${token}`},
        });
        // console.log('API CALLED:', res);

        if (res?.data?.data?.status === 2 && res?.data?.data) {
          const data = res?.data?.data;
          console.log('API VERIFICATION DATA: ', res.data);
          setVerificationData(res.data.data);
          setIsVerified(true);

          setFormData({
            fullName: data.fullName || '',
            dob: data.dob || '',
            gender: data.gender || 'male',
            country: data.country || '',
            address: data.address || '',
            idNumber: data.idNumber || '',
            issueDate: data.issueDate || '',
            expDate: data.expDate || '',
          });
          // Pre-fill image placeholders if URLs exist
          setIdFrontSide(
            data.idFrontSide
              ? {
                  uri: `${BASE_URL}${data.idFrontSide}`,
                  name: 'idFront.jpg',
                  type: 'image/jpeg',
                }
              : null,
          );

          setIdBackSide(
            data.idBackSide
              ? {
                  uri: `${BASE_URL}${data.idBackSide}`,
                  name: 'idBack.jpg',
                  type: 'image/jpeg',
                }
              : null,
          );

          setSelfie(
            data.selfie
              ? {
                  uri: `${BASE_URL}${data.selfie}`,
                  name: 'selfie.jpg',
                  type: 'image/jpeg',
                }
              : null,
          );
          setOriginalData({
            formData: {
              fullName: data.fullName || '',
              dob: data.dob || '',
              gender: data.gender || 'male',
              country: data.country || '',
              address: data.address || '',
              idNumber: data.idNumber || '',
              issueDate: data.issueDate || '',
              expDate: data.expDate || '',
              documentType: data.documentType || '',
            },
            idFrontSide: data.idFrontSide
              ? `${BASE_URL}${data.idFrontSide}`
              : null,
            idBackSide: data.idBackSide
              ? `${BASE_URL}${data.idBackSide}`
              : null,
            selfie: data.selfie ? `${BASE_URL}${data.selfie}` : null,
          });
        } else {
          setIsVerified(false);
          setShowSubmit(true);
        }
      } catch (error) {
        console.error('Error fetching verification data:', error);
      }
    };

    fetchVerification();
  }, []);

  async function requestCameraPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS permission handled differently
    }
  }
  const pickSelfieFromCamera = async setter => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to take a selfie.',
      );
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'front',
        saveToPhotos: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', 'Camera Error: ' + response.errorMessage);
        } else if (response.assets?.length > 0) {
          const asset = response.assets[0];
          setter({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName || 'selfie.jpg',
          });
        }
      },
    );
  };

  useEffect(() => {
    if (!originalData) return;

    const isFormChanged = Object.entries(formData).some(
      ([key, value]) => value !== originalData.formData[key],
    );

    const isImageChanged =
      (idFrontSide?.uri || null) !== originalData.idFrontSide ||
      (idBackSide?.uri || null) !== originalData.idBackSide ||
      (selfie?.uri || null) !== originalData.selfie;

    setShowSubmit(isFormChanged || isImageChanged);
  }, [formData, idFrontSide, idBackSide, selfie, originalData]);

  // const formatIdNumber = raw => {
  //   const digits = raw.replace(/\D/g, '').slice(0, 13); // Only keep digits and limit to 13
  //   let result = '';

  //   if (digits.length <= 5) {
  //     result = digits;
  //   } else if (digits.length <= 11) {
  //     result = `${digits.slice(0, 5)} ${digits.slice(5)}`;
  //   } else {
  //     result = `${digits.slice(0, 5)} ${digits.slice(5, 12)} ${digits.slice(
  //       12,
  //     )}`;
  //   }

  //   return result.trim();
  // };

  const handleInputChange = (key, value) => {
    if (key === 'idNumber') {
      const digits = value.replace(/\D/g, ''); // Only keep digits
      const formatted = formatIdNumber(digits);
      setFormData({...formData, [key]: formatted});
    } else {
      setFormData({...formData, [key]: value});
    }
  };

  const formatIdNumber = raw => {
    const digits = raw.replace(/\D/g, '').slice(0, 13); // Only keep digits and limit to 13
    let result = '';

    if (digits.length <= 5) {
      result = digits;
    } else if (digits.length <= 11) {
      result = `${digits.slice(0, 5)} ${digits.slice(5)}`;
    } else {
      result = `${digits.slice(0, 5)} ${digits.slice(5, 12)} ${digits.slice(
        12,
      )}`;
    }

    return result.trim();
  };

  useEffect(() => {
    setFormData({...formData, documentType: idType});
  }, [idType]);

  // Format date to YYYY-MM-DD
  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle date selection for DOB
  const handleDobChange = date => {
    setOpenDob(false);
    const formattedDate = formatDate(date);
    setFormData({...formData, dob: formattedDate});
  };

  // Handle date selection for Issue Date
  const handleIssueDateChange = date => {
    setOpenIssueDate(false);
    const formattedDate = formatDate(date);
    setFormData({...formData, issueDate: formattedDate});
  };

  // Handle date selection for Expiry Date
  const handleExpDateChange = date => {
    setOpenExpDate(false);
    const formattedDate = formatDate(date);
    setFormData({...formData, expDate: formattedDate});
  };

  // Handle gender selection
  const handleGenderSelect = gender => {
    setFormData({...formData, gender});
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

  // useEffect(() => {
  //   let timeout;
  //   if (loading) {
  //     timeout = setTimeout(() => {
  //       ToastAndroid.show(
  //         'Still submitting, please wait...',
  //         ToastAndroid.SHORT,
  //       );
  //     }, 10000); // 10 seconds
  //   }
  //   return () => clearTimeout(timeout);
  // }, [loading]);

  const handleSubmit = async () => {
    console.log('Submit button pressed ✅');

    const {
      fullName,
      dob,
      gender,
      country,
      address,
      documentType,
      idNumber,
      issueDate,
      expDate,
    } = formData;

    // if (
    //   !fullName ||
    //   !dob ||
    //   !gender ||
    //   !country ||
    //   !address ||
    //   !idNumber ||
    //   !issueDate ||
    //   !expDate ||
    //   !idFrontSide ||
    //   !idBackSide ||
    //   !documentType
    // ) {
    //   ToastAndroid.show(t('fillAllFields'), ToastAndroid.SHORT);
    //   return;
    // }

    // Prepare form data with only the fields that have been changed or are provided
    const data = new FormData();
    if (fullName) data.append('fullName', fullName);
    if (dob) data.append('dob', dob);
    if (gender) data.append('gender', gender);
    if (country) data.append('country', country);
    if (address) data.append('address', address);
    if (documentType) data.append('documentType', documentType);
    if (idNumber) data.append('idNumber', idNumber);
    if (issueDate) data.append('issueDate', issueDate);
    if (expDate) data.append('expDate', expDate);
    if (idFrontSide) data.append('idFrontSide', idFrontSide);
    if (idBackSide) data.append('idBackSide', idBackSide);
    if (selfie) {
      data.append('selfie', {
        uri: selfie.uri,
        name: selfie.name,
        type: selfie.type || 'image/jpeg',
      });
    }
    // Add user ID to the form data for updateVerification
    if (isVerified) {
      data.append('id', verificationData.id);
    }
    console.log('Data being sent to API:', data);
    try {
      setLoading(true);
      // const response = await API.post('verification', data, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      let response;
      if (isVerified) {
        // Use updateVerification endpoint if verification details are present
        response = await API.post('updateVerfication', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use verification endpoint if no verification details are present
        response = await API.post('verification', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      console.log('API Response:', response.data);
      if (response.status === 200 && response.data.success) {
        Alert.alert('Success', 'Verification completed!');
        navigation.navigate('MainTabs', {
          screen: 'Profile',
        });
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
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  // Convert string dates to Date objects for pickers
  const parseDateString = dateString => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calculate maximum date for DOB (today)
  const maxDobDate = new Date();

  // Calculate minimum date for Issue Date (can be in the past)
  const minIssueDate = new Date();
  minIssueDate.setFullYear(minIssueDate.getFullYear() - 20);

  // Calculate minimum date for Expiry Date (today)
  const minExpDate = new Date();

  const renderDateInput = (
    key,
    label,
    placeholder,
    openState,
    setOpenState,
    onConfirm,
    maxDate,
    minDate,
  ) => (
    <View key={key} style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setOpenState(true)}>
        <Text style={formData[key] ? styles.dateText : styles.datePlaceholder}>
          {formData[key] || placeholder}
        </Text>
        <View style={styles.calendarIcon}>
          <CalendersSVG height={22} width={22} fill={colors.gray} />
        </View>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openState}
        date={parseDateString(formData[key])}
        mode="date"
        theme="light"
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
        <MainHeader title={'Verification'} showBackIcon={true} />
        <View style={styles.container}>
          {/* Full Name input (first field) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('fullName')}</Text>
            <TextInput
              // editable={!isVerified}
              style={styles.input}
              placeholder={t('enterFullName')}
              value={formData.fullName}
              onChangeText={text => handleInputChange('fullName', text)}
            />
          </View>

          {/* Date of Birth input (second field) */}
          {renderDateInput(
            'dob',
            t('dateOfBirth'),
            t('enterDOB'),
            openDob,
            setOpenDob,
            handleDobChange,
            maxDobDate, // Maximum date is today (users can't be born in the future)
            null, // No minimum date for DOB
          )}

          {/* Gender Radio Buttons */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('gender')}</Text>
            <View style={styles.radioGroup}>
              <RadioButton
                selected={formData.gender === 'male'}
                onPress={() => handleGenderSelect('male')}
                label={t('male')}
              />
              <RadioButton
                selected={formData.gender === 'female'}
                onPress={() => handleGenderSelect('female')}
                label={t('female')}
              />
              <RadioButton
                selected={formData.gender === 'other'}
                onPress={() => handleGenderSelect('other')}
                label={t('other')}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <DropDownPicker
              open={countryOpen}
              value={formData.country}
              items={countryItems}
              setOpen={setCountryOpen}
              setValue={val => handleInputChange('country', val())}
              setItems={setCountryItems}
              placeholder="Select Country"
              zIndex={3000}
              zIndexInverse={1000}
              style={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#ccc', // Match with your input borderColor
                borderRadius: 8,
              }}
              dropDownContainerStyle={{
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#ccc', // Optional: match dropdown container too
              }}
            />
          </View>

          {/* Remaining text inputs */}
          {['address'].map(key => {
            const labelMap = {
              // country: 'Country',
              address: 'Address',
              // idNumber: 'ID Number',
            };
            const placeholderMap = {
              // country: 'Enter Country',
              address: 'Enter Address',
              // idNumber: 'Enter ID Number',
            };
            return (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.label}>{t(`${key}`)}</Text>
                <TextInput
                  // editable={!isVerified}
                  style={styles.input}
                  placeholder={placeholderMap[key]}
                  value={formData[key]}
                  onChangeText={text => handleInputChange(key, text)}
                />
              </View>
            );
          })}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID Type</Text>
            <View style={[styles.radioGroup, {justifyContent: 'space-around'}]}>
              <RadioButton
                label="cnic"
                selected={idType === 'cnic'}
                onPress={() => setIdType('cnic')}
              />
              <RadioButton
                label="Driving License"
                selected={idType === 'drivingLicense'}
                onPress={() => setIdType('drivingLicense')}
                style={{marginLeft: 'auto'}}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID Number</Text>

            <TextInput
              style={styles.input}
              value={formData.idNumber}
              onChangeText={text => handleInputChange('idNumber', text)}
              placeholder="ID Number"
              keyboardType="numeric"
              // editable={formData.idNumber.replace(/\D/g, '').length < 13}
              maxLength={15}
            />
          </View>

          {/* Remaining date inputs - now in separate lines */}
          <View style={{marginBottom: 12}}>
            <View style={{marginBottom: 12}}>
              {renderDateInput(
                'issueDate',
                t('issueDate'),
                t('enterIssueDate'),
                openIssueDate,
                setOpenIssueDate,
                handleIssueDateChange,
                null, // No maximum date for issue date
                minIssueDate, // Minimum date is 20 years ago
              )}
            </View>
            <View>
              {renderDateInput(
                'expDate',
                t('expDate'),
                t('enterExpDate'),
                openExpDate,
                setOpenExpDate,
                handleExpDateChange,
                null, // No maximum date for expiry date
                minExpDate, // Minimum date is today (can't expire in the past)
              )}
            </View>
          </View>

          <View style={styles.uploadRow}>
            {[
              {
                label: t('uploadFrontID'),
                state: idFrontSide,
                setter: setIdFrontSide,
              },
              {
                label: t('uploadBackID'),
                state: idBackSide,
                setter: setIdBackSide,
              },
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
                      <Text style={styles.uploadLabel}>{label}</Text>
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
                onPress={() => pickSelfieFromCamera(setSelfie)}>
                {selfie ? (
                  <Image
                    source={{uri: selfie.uri}}
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
                    <Text style={styles.uploadLabel}>{t('uploadSelfie')}</Text>
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

          <MyButton
            onPress={handleSubmit}
            disabled={loading || !showSubmit}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.green} />
            ) : (
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                {isVerified ? 'Update Verification' : 'Submit Verification'}
              </Text>
            )}
          </MyButton>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{t('documentPending')}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}>
                <Regular style={styles.modalButtonText}>{t('close')}</Regular>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationScreen;
