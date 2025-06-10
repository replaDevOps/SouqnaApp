import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {CloseSvg} from '../../assets/svg';
import {placeOrder} from '../../api/apiServices';
import {useSelector} from 'react-redux';
import {colors} from '../../util/color';

const PaymentModal = ({visible, onClose, onSelectPaymentMethod}) => {
  const {token} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('CARD');

  const handleOrderSubmit = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        paymentType: selectedMethod === 'CARD' ? 1 : 2,
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
    setLoading(false);
  };

  const handleSelectPaymentMethod = value => {
    setSelectedMethod(value);
    if (onSelectPaymentMethod) {
      onSelectPaymentMethod(value); // Optional callback for parent component
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CloseSvg />
          </TouchableOpacity>
          <Text style={styles.title}>{t('selectPaymentMethod')}</Text>

          <View style={styles.content}>
            <TouchableOpacity
              style={[
                styles.option,
                selectedMethod === 'CARD' && styles.selectedOption,
              ]}
              onPress={() => handleSelectPaymentMethod('CARD')}>
              <RadioButton
                value="CARD"
                color={colors.green}
                status={selectedMethod === 'CARD' ? 'checked' : 'unchecked'}
              />
              <Text style={styles.label}>{t('stripe')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                selectedMethod === 'COD' && styles.selectedOption,
              ]}
              onPress={() => handleSelectPaymentMethod('COD')}>
              <RadioButton
                value="COD"
                color={colors.green}
                status={selectedMethod === 'COD' ? 'checked' : 'unchecked'}
              />
              <Text style={styles.label}>{t('cashOnDelivery')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleOrderSubmit} style={styles.button}>
            <Text style={styles.buttonText}>
              {loading ? t('processing') : t('confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    height: '30%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: colors.lightgreen,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },

  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 0},
  option: {flexDirection: 'row', alignItems: 'center', marginVertical: 4},
  label: {fontSize: 16},
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 5,
  },
  // button: {
  //   width: '100%',
  //   marginTop: 50,
  //   backgroundColor: colors.lightgreen,
  //   padding: 10,
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
  buttonText: {color: 'white', fontWeight: 'bold'},
});

export default PaymentModal;
