import {useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  I18nManager,
} from 'react-native';
import CustomText from '../../CustomText';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const currencies = ['USD', 'SYP', 'TRY'];

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

  // Detect RTL layout
  const isRTL = I18nManager.isRTL;

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

  const dropdownHeight = 132;
  const dropdownItemHeight = 44;
  const dropdownItems = currencies.length;

  // Calculate dropdown position based on RTL
  const getDropdownPosition = () => {
    const baseLeft = isRTL
      ? buttonPosition.x - 80 // Position dropdown to the left in RTL
      : buttonPosition.x - 20; // Position dropdown to the right in LTR

    return {
      top: buttonPosition.y + buttonPosition.height + 5,
      left: baseLeft,
    };
  };

  const dropdownPosition = getDropdownPosition();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {flexDirection: isRTL ? 'row-reverse' : 'row'},
        ]}>
        <TextInput
          style={[styles.textInput, {textAlign: isRTL ? 'right' : 'left'}]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType="numeric"
          placeholderTextColor="#999"
          maxLength={9}
        />
        <TouchableOpacity
          ref={buttonRef}
          style={[
            styles.currencyButton,
            {
              borderLeftWidth: isRTL ? 0 : 1,
              borderRightWidth: isRTL ? 1 : 0,
            },
          ]}
          onPress={toggleDropdown}>
          <CustomText style={styles.currencyText}>
            {selectedCurrency} {'\u25BC'}
          </CustomText>
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowDropdown(false)}
            activeOpacity={1}>
            <View style={[styles.dropdown, dropdownPosition]}>
              <FlatList
                data={currencies}
                keyExtractor={item => item}
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    style={[
                      styles.dropdownItem,
                      {alignItems: isRTL ? 'flex-end' : 'flex-start'},
                    ]}>
                    <CustomText
                      style={[
                        styles.dropdownItemText,
                        {textAlign: isRTL ? 'right' : 'left'},
                      ]}>
                      {item}
                    </CustomText>
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
    marginVertical: mvs(8),
  },
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#cccccc', // Match your existing input border color
    borderRadius: mvs(5), // Match your existing border radius
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.white,
    minHeight: mvs(50), // Match your input height
  },
  textInput: {
    flex: 1,
    fontFamily: 'Amiri-Regular', // Match your existing font family
    paddingVertical: mvs(8),
    paddingHorizontal: mvs(14),
    fontSize: mvs(16), // Match your existing font size
    color: '#333', // Match your existing text color
  },
  currencyButton: {
    width: mvs(80),
    paddingVertical: mvs(10),
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: mvs(48), // Slightly less than container to fit nicely
  },
  currencyText: {
    // fontWeight: '600',
    fontSize: mvs(14),
    color: '#333',
  },
  modalBackground: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    width: mvs(100),
    height: mvs(132),
    backgroundColor: colors.white,
    borderRadius: mvs(8),
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    zIndex: 999,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownItem: {
    padding: mvs(12),
    borderBottomWidth: 1,
    borderColor: '#eee',
    minHeight: mvs(44),
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontSize: mvs(14),
    color: '#333',
    // fontWeight: '500',
  },
});

export default PriceInputWithDropdown;
