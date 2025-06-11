import React, {useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Linking,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MainHeader from '../../components/Headers/MainHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './style';
import {Snackbar} from 'react-native-paper';
import {placeOrder} from '../../api/apiServices';
import {useSelector} from 'react-redux';

const CheckoutScreen = ({navigation, onSubmit}) => {
  const {token} = useSelector(state => state.user);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [items, setItems] = useState([
    {label: 'Cash on Delivery', value: 'COD'},
    {label: 'Stripe', value: 'CARD'},
  ]);
  const [region, setRegion] = useState('');
  const [regionOpen, setRegionOpen] = useState(false);
  const [regionItems, setRegionItems] = useState([
    {label: 'Riyadh', value: 'Riyadh'},
    {label: 'Makkah', value: 'Makkah'},
    {label: 'Madinah', value: 'Madinah'},
    {label: 'Eastern Province', value: 'Eastern Province'},
    {label: 'Asir', value: 'Asir'},
    {label: 'Tabuk', value: 'Tabuk'},
    {label: 'Hail', value: 'Hail'},
    {label: 'Northern Borders', value: 'Northern Borders'},
    {label: 'Jazan', value: 'Jazan'},
    {label: 'Najran', value: 'Najran'},
    {label: 'Al-Bahah', value: 'Al-Bahah'},
    {label: 'Al-Jawf', value: 'Al-Jawf'},
    {label: 'Al-Qassim', value: 'Al-Qassim'},
  ]);

  const handleConfirm = async () => {
    if (!name || !phone || !street || !city || !region) {
      setSnackbarMsg('Please fill in all required fields.');
      setSnackbarVisible(true);
      return;
    }

    const formData = {
      name,
      phone,
      street,
      city,
      region,
      postalCode,
      notes,
      paymentMethod,
    };
    setLoading(true);
    await handleOrderSubmit(formData);
    setLoading(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOrderSubmit = async formData => {
    try {
      const orderPayload = {
        paymentType: formData.paymentMethod === 'CARD' ? 1 : 2,
      };

      const result = await placeOrder(orderPayload, token);

      if (result?.success) {
        if (orderPayload.paymentType === 1 && result.url) {
          // Stripe
          Linking.openURL(result.url);
        } else if (orderPayload.paymentType === 2 && result.link) {
          // PayPal
          Linking.openURL(result.link);
        } else {
          // Fallback or success page
          console.log('Order placed successfully without redirect.');
        }
      } else {
        console.log(
          'Order placement failed:',
          result?.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.error('Order placement error:', err);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" />
      <MainHeader title={'Checkout'} showBackIcon={handleBack} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Delivery Details</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={street}
              onChangeText={setStreet}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
            {/* <Text style={styles.label}>Region</Text> */}
            <DropDownPicker
              open={regionOpen}
              value={region}
              items={regionItems}
              setOpen={setRegionOpen}
              setValue={setRegion}
              setItems={setRegionItems}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select a region"
            />

            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              keyboardType="number-pad"
              value={postalCode}
              onChangeText={setPostalCode}
            />
            <TextInput
              style={[styles.input, {height: 80}]}
              placeholder="Notes (optional)"
              multiline
              value={notes}
              onChangeText={setNotes}
            />

            <Text style={styles.label}>Payment Method</Text>
            <DropDownPicker
              open={openDropdown}
              value={paymentMethod}
              items={items}
              setOpen={setOpenDropdown}
              setValue={setPaymentMethod}
              setItems={setItems}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              placeholder="Select a method"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirm}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Processing...' : 'Confirm Order'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{
              label: 'Close',
              onPress: () => setSnackbarVisible(false),
            }}>
            {snackbarMsg}
          </Snackbar>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
