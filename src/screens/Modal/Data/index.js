import {Linking, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {useNavigation} from '@react-navigation/native';
import {OpenSVG} from '../../../assets/svg';
import Regular from '../../../typography/RegularText';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const DataScreen = () => {
  const navigation = useNavigation();
    const {t} = useTranslation();
  const handleBack = () => {
    navigation.goBack();
  };

  const openUrl = url => {
    Linking.openURL(url);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ModalHeader title={t('Dark')} onBack={handleBack} />
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            console.log('Privacy Settings Pressed');
          }}>
          <Regular style={styles.menuText}>
           {t('privacySettingsMeasurement')}
          </Regular>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://themen.kleinanzeigen.de/datenschutzerklaerung/');
          }}>
          <Text style={styles.menuText}>{t('Privacy Policy')}</Text>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://themen.kleinanzeigen.de/nutzungsbedingungen/');
          }}>
          <Text style={styles.menuText}>{t('termsOfUse')}</Text>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DataScreen;
