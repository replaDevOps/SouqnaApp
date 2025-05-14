import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';

const currencies = ['USD', 'TRY', 'SYP'];

const PriceInputWithDropdown = ({
  value,
  onChangeText,
  selectedCurrency = 'USD',
  onCurrencyChange,
  placeholder,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef(null);
  const [buttonPosition, setButtonPosition] = useState({x: 0, y: 0, height: 0});

  const toggleDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonPosition({x, y, height});
        setShowDropdown(prev => !prev);
      });
    }
  };

  const handleSelect = currency => {
    onCurrencyChange(currency);
    setShowDropdown(false);
  };

  const dropdownHeight = 132; // Total height of the dropdown
  const dropdownItemHeight = 44; // Each item height in the dropdown
  const dropdownItems = currencies.length;

  // Calculate the position so the dropdown is centered above and below
  const calculatedTop = buttonPosition.y - dropdownHeight / 2;
  const calculatedBottom =
    buttonPosition.y + buttonPosition.height + dropdownHeight / 2;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          ref={buttonRef}
          style={styles.currencyButton}
          onPress={toggleDropdown}>
          <Text style={styles.currencyText}>
            {selectedCurrency} {'\u25BC'} {/* Unicode Down Arrow */}
          </Text>
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowDropdown(false)}
            activeOpacity={1}>
            <View
              style={[
                styles.dropdown,
                {
                  top: Math.max(calculatedTop, 0), // Ensuring dropdown doesn't overflow above screen
                  left: buttonPosition.x - 50,
                },
              ]}>
              <FlatList
                data={currencies}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={styles.dropdownItem}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  currencyButton: {
    width: 80,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  modalBackground: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    width: 100,
    height: 132,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});

export default PriceInputWithDropdown;
