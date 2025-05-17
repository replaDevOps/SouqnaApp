// components/modals/CardDetailsModal.js

import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CardDetailsModal = ({visible, onClose, onSubmit}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSave = () => {
    onSubmit({
      cardNumber,
      cardName,
      expiryMonth: parseInt(expiryMonth),
      expiryYear: parseInt(expiryYear),
      cvc: parseInt(cvc),
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.cardBox}>
          <Text style={styles.title}>Enter Card Details</Text>

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

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CardDetailsModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // padding: 20,
  },
  cardBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#007BFF',
    borderRadius: 6,
  },
  btnText: {
    color: 'white',
  },
});
