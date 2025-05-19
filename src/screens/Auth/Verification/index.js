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
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
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
  const [idType, setIdType] = useState('idCard'); // 'idCard' or 'drivingLicense'

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

  const handleInputChange = (key, value) => {
    setFormData({...formData, [key]: value});
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
      !idBackSide ||
      !documentType
    ) {
      ToastAndroid.show(t('fillAllFields'), ToastAndroid.SHORT);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append('idFrontSide', idFrontSide);
    data.append('idBackSide', idBackSide);
    data.append('selfie', selfie);
    console.log('Data being sent to API:', data);
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
      ToastAndroid.show(message, ToastAndroid.LONG);
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
  minIssueDate.setFullYear(minIssueDate.getFullYear() - 20); // Allow up to 20 years in the past for issue date

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
              editable={!isVerified}
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

          {/* Remaining text inputs */}
          {['country', 'address'].map(key => {
            const labelMap = {
              country: 'Country',
              address: 'Address',
              // idNumber: 'ID Number',
            };
            const placeholderMap = {
              country: 'Enter Country',
              address: 'Enter Address',
              // idNumber: 'Enter ID Number',
            };
            return (
              <View key={key} style={styles.inputContainer}>
                <Text style={styles.label}>{t(`${key}`)}</Text>
                <TextInput
                  editable={!isVerified}
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
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
              <RadioButton
                label="ID Card"
                selected={idType === 'idCard'}
                onPress={() => setIdType('idCard')}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
              }}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                maxLength={5}
                keyboardType="numeric"
                placeholder="12345"
                value={formData.idNumber.split('-')[0] || ''}
                onChangeText={text => {
                  const existing = formData.idNumber.split('-');
                  const second = existing[1] || '';
                  const third = existing[2] || '';
                  handleInputChange('idNumber', `${text}-${second}-${third}`);
                }}
              />
              <TextInput
                style={[styles.input, {flex: 1}]}
                maxLength={7}
                keyboardType="numeric"
                placeholder="1234567"
                value={formData.idNumber.split('-')[1] || ''}
                onChangeText={text => {
                  const existing = formData.idNumber.split('-');
                  const first = existing[0] || '';
                  const third = existing[2] || '';
                  handleInputChange('idNumber', `${first}-${text}-${third}`);
                }}
              />
              <TextInput
                style={[styles.input, {flex: 1}]}
                maxLength={1}
                keyboardType="numeric"
                placeholder="1"
                value={formData.idNumber.split('-')[2] || ''}
                onChangeText={text => {
                  const existing = formData.idNumber.split('-');
                  const first = existing[0] || '';
                  const second = existing[1] || '';
                  handleInputChange('idNumber', `${first}-${second}-${text}`);
                }}
              />
            </View>
          </View>

          {/* Remaining date inputs */}
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
                onPress={() => pickImage(setSelfie)}>
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
                {'Submit Verification'}
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
