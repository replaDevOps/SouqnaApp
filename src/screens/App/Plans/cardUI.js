import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import DownloadIconSvg from '../../../assets/svg/downloadSvg';
import {CardSVG} from '../../../assets/svg';
import DownArrowSvg from '../../../assets/svg/down-arrow-svg';
import MasterSVG from '../../../assets/svg/masterSVG';
import {colors} from '../../../util/color';
import VisaSVG from '../../../assets/svg/visaSVG';
import MainHeader from '../../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {submitCardDetails} from '../../../api/apiServices';
import {useTranslation} from 'react-i18next';

const CardUI = () => {
  const navigation = useNavigation();
  const {token} = useSelector(state => state.user);

  // State for form fields
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState('Jhon');
  const [expiry, setExpiry] = useState('12/25'); // MM/YY format
  const [cvc, setCvc] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation();

  // Parse expiry MM/YY to month and year numbers
  const parseExpiry = expiryStr => {
    const [mm, yy] = expiryStr.split('/');
    if (!mm || !yy) return {month: null, year: null};
    return {month: parseInt(mm.trim()), year: 2000 + parseInt(yy.trim())};
  };

  const handleSave = async () => {
    // Validation
    if (
      !cardNumber.trim() ||
      !cardName.trim() ||
      !expiry.trim() ||
      !cvc.trim()
    ) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }

    // Validate expiry format MM/YY
    const {month, year} = parseExpiry(expiry);
    if (
      !month ||
      !year ||
      month < 1 ||
      month > 12 ||
      year < new Date().getFullYear()
    ) {
      Alert.alert('Validation Error', 'Expiry date is invalid');
      return;
    }
    // Prepare data payload
    const cardData = {
      cardNumber: cardNumber.trim(),
      cardName: cardName.trim(),
      expiryMonth: month,
      expiryYear: year,
      cvc: parseInt(cvc),
    };

    try {
      setLoading(true);
      const response = submitCardDetails(cardData, token);
      Alert.alert('Success', 'Card saved successfully!');
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save card',
      );
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces automatically (optional)
  const formatCardNumber = text => {
    // Remove non-digits
    const cleaned = text.replace(/\D+/g, '');
    // Group in 4 digits separated by space
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
  };

  // Format expiry MM/YY automatically (optional)
  const formatExpiry = text => {
    // Remove non-digits and slash
    const cleaned = text.replace(/[^\d]/g, '');
    if (cleaned.length === 0) {
      setExpiry('');
      return;
    }
    if (cleaned.length <= 2) {
      setExpiry(cleaned);
    } else {
      setExpiry(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader title={'Card Details'} showBackIcon={true} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={{alignItems: 'center', marginVertical: 20}}>
            <Image
              source={require('../../../assets/img/logo1.png')}
              style={{width: 120, height: 120, resizeMode: 'cover'}}
            />
          </View>
          <Text style={styles.header}>{t('paymentMethod')}</Text>

          <View style={styles.paymentOption}>
            <View style={styles.radioRow}>
              <View style={styles.radioButton}>
                <View style={styles.radioInner} />
              </View>
              <CardSVG width={24} height={24} />
              <Text style={styles.optionText}>{t('Card')}</Text>
            </View>

            <Text style={styles.sectionTitle}>{t('Card information')}</Text>
            <View style={styles.cardNumberContainer}>
              <TextInput
                style={styles.cardNumberInput}
                placeholder="1234 1234 1234 1234"
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={formatCardNumber}
              />
              <View style={styles.cardBrands}>
                <VisaSVG width={30} height={20} style={styles.cardBrand} />
                <MasterSVG width={30} height={20} style={styles.cardBrand} />
              </View>
            </View>

            <View style={styles.expiryAndCvcContainer}>
              <TextInput
                style={[styles.expiryInput, styles.halfInput]}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
                value={expiry}
                onChangeText={formatExpiry}
              />
              <View style={styles.cvcContainer}>
                <TextInput
                  style={styles.cvcInput}
                  placeholder="CVC"
                  keyboardType="numeric"
                  maxLength={4}
                  value={cvc}
                  onChangeText={setCvc}
                />
                <TouchableOpacity style={styles.cvcHelpIcon}>
                  <DownloadIconSvg width={20} height={20} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionTitle}>{t('Cardholder name')}</Text>
            <TextInput
              style={styles.fullInput}
              placeholder={t('Enter name on card')}
              value={cardName}
              onChangeText={setCardName}
            />

            <Text style={styles.sectionTitle}>{t('Country or Region')}</Text>
            <TouchableOpacity style={styles.countrySelector}>
              <Text>Pakistan</Text>
              <DownArrowSvg width={30} height={20} fill={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setSaveInfo(!saveInfo)}>
              {saveInfo && (
                <View style={styles.checkmarkContainer}>
                  <Text>✔</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxTitle}>
                {t('Yes, I agree with terms and conditions')}
              </Text>
              {/* <Text style={styles.checkboxSubtitle}>
              Pay faster on Blackbox and everywhere Link is accepted.
            </Text> */}
            </View>
          </View>
          {loading && (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{marginBottom: 20}}
            />
          )}

          <TouchableOpacity
            style={styles.startTrialButton}
            onPress={handleSave}>
            <Text style={styles.startTrialText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: colors.white,
    // padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentOption: {
    backgroundColor: 'rgba(179, 176, 176, 0.09)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
  },
  cardNumberInput: {
    flex: 1,
    padding: 10,
  },
  cardBrands: {
    flexDirection: 'row',
    paddingRight: 8,
  },
  cardBrand: {
    // width: 30,
    // height: 20,
    marginLeft: 4,
  },
  expiryAndCvcContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfInput: {
    width: '48%',
  },
  expiryInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  cvcContainer: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvcInput: {
    flex: 1,
    padding: 10,
  },
  cvcHelpIcon: {
    marginRight: 8,
  },
  fullInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  countrySelector: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  startTrialButton: {
    backgroundColor: '#adbd6e',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  startTrialText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollViewContent: {
    // flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    //   padding: 16,
    width: '100%',
  },
});

export default CardUI;
