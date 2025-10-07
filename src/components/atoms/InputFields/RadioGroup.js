// RadioGroup.js
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Regular from '../../../typography/RegularText';
import styles from '../../../screens/Auth/Register/styles';

const RadioGroup = ({options, selectedOption, onSelect}) => {
  return (
    <View style={styles.radioButtonContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.radioButton,
            selectedOption === option.value && styles.selectedRadioButton,
          ]}
          onPress={() => onSelect(option.value)}>
          <View
            style={[
              styles.radioCircle,
              selectedOption === option.value && styles.selectedCircle,
            ]}>
            {selectedOption === option.value && (
              <View style={styles.radioDot} />
            )}
          </View>
          <Regular style={styles.radioButtonLabel}>{option.label}</Regular>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioGroup;
