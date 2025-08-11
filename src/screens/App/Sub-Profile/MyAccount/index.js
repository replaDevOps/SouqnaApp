import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import OnSVG from '../../../../assets/svg/OnSVG';
import {OffSVG} from '../../../../assets/svg';
import MainHeader from '../../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {GetSeller} from '../../../../api/apiServices';
import CustomText from '../../../../components/CustomText';

export default function MyAccount() {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: '',
    phone: '',
    email: '',
    sellerType: 0,
  });

  const [editedData, setEditedData] = useState(originalData);

  const {t} = useTranslation();
  const {token} = useSelector(state => state.user);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      if (!token) return;

      const sellerData = await GetSeller(token);
      console.log('Seller Data:', sellerData);

      if (sellerData) {
        const formattedData = {
          name: sellerData.data?.name || '',
          phone: sellerData.data?.phoneNo || '',
          email: sellerData.data?.email || '',
          sellerType: sellerData.data?.sellerType ?? 0,
        };
        setOriginalData(formattedData);
        setEditedData(formattedData);
      }
    };

    fetchSellerDetails();
  }, [token]);

  const handleEditToggle = () => {
    if (isEditing) {
      setOriginalData(editedData);
    } else {
      setEditedData(originalData);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedData(originalData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({...prev, [field]: value}));
  };

  const toggleMember = () => {
    setEditedData(prev => ({...prev, isMember: !prev.isMember}));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexOne}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.flexOne}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <MainHeader title={t('My Account')} showBackIcon={true} />
            <View>
              {/* Profile Image */}
              <View style={styles.profileImageContainer}>
                <View style={styles.profileImageWrapper}>
                  <Image
                    style={styles.profileImage}
                    source={require('../../../../assets/img/profile.png')}
                  />
                </View>
              </View>

              {/* Personal Info */}
              <View style={styles.card}>
                <CustomText style={styles.cardTitle}>
                  {t('Personal Info')}
                </CustomText>

                {renderEditableRow(t('yourName'), 'name')}
                {/* {renderEditableRow(t('occupation'), 'occupation')} */}
                {/* {renderEditableRow(t('address'), 'address')} */}

                <View style={styles.row}>
                  <CustomText style={styles.label}>
                    {t('sellerType')}
                  </CustomText>
                  {isEditing ? (
                    <TouchableOpacity
                      onPress={() =>
                        handleChange(
                          'sellerType',
                          editedData.sellerType === 1 ? 0 : 1,
                        )
                      }>
                      {editedData.sellerType === 1 ? (
                        <OnSVG
                          width={50}
                          height={50}
                          stroke={'white'}
                          fill={'green'}
                        />
                      ) : (
                        <OffSVG
                          width={50}
                          height={50}
                          stroke={'white'}
                          fill={'green'}
                        />
                      )}
                    </TouchableOpacity>
                  ) : (
                    <CustomText style={styles.value}>
                      {editedData.sellerType === 1
                        ? t('Company')
                        : t('Private')}
                    </CustomText>
                  )}
                </View>
              </View>

              {/* Contact Info */}
              <View style={[styles.card, {marginTop: 16, marginBottom: 24}]}>
                <CustomText style={styles.cardTitle}>
                  {t('Contact Info')}
                </CustomText>

                {renderEditableRow(t('phoneNumber'), 'phone', 'phone-pad')}
                {renderEditableRow(t('email'), 'email', 'email-address')}
              </View>
            </View>

            {/* Save/Cancel Buttons */}
            <View style={styles.centered}>
              <View style={styles.buttonRow}>
                {isEditing ? (
                  <>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={handleCancel}>
                      <CustomText style={styles.cancelText}>
                        {t('Cancel')}
                      </CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={handleEditToggle}>
                      <CustomText style={styles.saveText}>
                        {t('save')}
                      </CustomText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={handleEditToggle}>
                    <CustomText style={styles.editText}>
                      {t('editProfile')}
                    </CustomText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  function renderEditableRow(label, field, keyboardType = 'default') {
    return (
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <CustomText style={styles.label} numberOfLines={1}>
            {label}
          </CustomText>
        </View>
        <View style={styles.valueContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData[field]}
              onChangeText={text => handleChange(field, text)}
              keyboardType={keyboardType}
              placeholder={label}
              placeholderTextColor="#9CA3AF"
            />
          ) : (
            <CustomText
              style={styles.value}
              numberOfLines={1}
              ellipsizeMode="tail">
              {editedData[field]}
            </CustomText>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileImageContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  profileImageWrapper: {
    backgroundColor: '#BBF7D0', // green-200
    borderRadius: 999,
    width: 144,
    height: 144,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 112,
    height: 112,
    borderRadius: 999,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 0.4,
    paddingRight: 8,
  },

  valueContainer: {
    flex: 0.6,
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },

  value: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'right',
  },

  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
    color: '#111827',
    width: '100%',
    textAlign: 'left',
    // textAlignVertical:'top',
  },

  centered: {
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
  },
  cancelText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#008e91',
  },
  saveText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  editBtn: {
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    width: 320,
    backgroundColor: '#008e91',
  },
  editText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    color: 'white',
  },
});
