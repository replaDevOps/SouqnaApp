import {Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';

const DesignScreen = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('light');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelect = value => {
    setSelectedOption(value);
  };

  return (
    <View>
      <ModalHeader title="Design" onBack={handleBack} />

      <View style={styles.menuContainer}>
        <Regular style={styles.regularText}>
          The dark design protects your battery and saves a lot of energy. Good
          for you, good for the environment.
        </Regular>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log('System Default Pressed');
          }}>
          <Regular style={styles.menuText}>System Default</Regular>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleSelect('dark')}>
          <View
            style={[
              styles.radioCircle,
              selectedOption === 'dark' && styles.selectedCircle,
            ]}>
            {selectedOption === 'dark' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.menuText}>Dark Design</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleSelect('light')}>
          <View
            style={[
              styles.radioCircle,
              selectedOption === 'light' && styles.selectedCircle,
            ]}>
            {selectedOption === 'light' && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.menuText}>Light Design</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DesignScreen;
