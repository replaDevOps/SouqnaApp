import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {useNavigation} from '@react-navigation/native';
import Regular from '../../../typography/RegularText';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';

const DesignScreen = () => {
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState('light');
  const {t} = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelect = value => {
    setSelectedOption(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ModalHeader title={t('Design')} onBack={handleBack} />

      <View style={styles.menuContainer}>
        <Regular style={styles.regularText}>{t('designDescription')}</Regular>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log('System Default Pressed');
          }}>
          <Regular style={styles.menuText}>{t('System Default')}</Regular>
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
          <CustomText style={styles.menuText}>{t('Dark Design')}</CustomText>
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
          <CustomText style={styles.menuText}>{t('Light Design')}</CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DesignScreen;
