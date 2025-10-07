import {Linking, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {OpenSVG} from '../../../assets/svg';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';

const AboutScreen = () => {
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
      <ModalHeader title={t('About Souqna')} onBack={handleBack} />
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://www.kleinanzeigen.de/impressum.html');
          }}>
          <CustomText style={styles.menuText}>{t('Imprint')}</CustomText>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://themen.kleinanzeigen.de/careers/');
          }}>
          <CustomText style={styles.menuText}>{t('Career Page')}</CustomText>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AboutScreen;
