import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {submitCardDetails} from '../../../api/apiServices';
import CustomText from '../../CustomText';
import {useTranslation} from 'react-i18next';

const CardDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const onSubmit = route.params?.onSubmit;
  const {token} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState('Jhon');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('2025');
  const [cvc, setCvc] = useState('');
  const {t} = useTranslation();

  const handleSave = async () => {
    if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvc) {
      Alert.alert(t('validationError'), t('pleaseFillAllFields'));
      return;
    }

    const cardData = {
      cardNumber,
      cardName,
      expiryMonth: parseInt(expiryMonth),
      expiryYear: parseInt(expiryYear),
      cvc: parseInt(cvc),
    };

    try {
      setLoading(true);
      const response = await submitCardDetails(cardData, token);
      if (onSubmit) onSubmit(response); // Optional callback
      Alert.alert(t('success'), t('cardSavedSuccessfully'));
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert(
        t('error'),
        error.response?.data?.message || t('failedToSaveCard'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardBox}>
        <CustomText style={styles.title}>Enter Stripe Card Details</CustomText>

        <TextInput
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Cardholder Name"
          value={cardName}
          onChangeText={setCardName}
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput
            placeholder="MM"
            value={expiryMonth}
            onChangeText={setExpiryMonth}
            keyboardType="numeric"
            style={[styles.input, {flex: 1, marginRight: 8}]}
          />
          <TextInput
            placeholder="YYYY"
            value={expiryYear}
            onChangeText={setExpiryYear}
            keyboardType="numeric"
            style={[styles.input, {flex: 1}]}
          />
        </View>
        <TextInput
          placeholder="CVC"
          value={cvc}
          onChangeText={setCvc}
          keyboardType="numeric"
          style={styles.input}
        />

        {loading && <ActivityIndicator style={{marginVertical: 10}} />}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}>
            <CustomText style={styles.btnText}>{t('Cancel')}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <CustomText style={styles.btnText}>{t('save')}</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CardDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#008e91',
    justifyContent: 'center',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  cardBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  saveBtn: {
    padding: 10,
    backgroundColor: '#',
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
  },
});
