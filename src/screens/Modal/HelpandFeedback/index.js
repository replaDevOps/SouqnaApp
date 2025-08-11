import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {OpenSVG} from '../../../assets/svg';
import styles from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import CustomText from '../../../components/CustomText';

const HelpScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ModalHeader title={t('Help and Feedback')} onBack={handleBack} />
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://hilfe.kleinanzeigen.de/hc/de');
          }}>
          <CustomText style={styles.menuText}>{t('Help Area')}</CustomText>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <CustomText style={styles.menuText}>
            {t('Report a Problem')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <CustomText style={styles.menuText}>
            {t('Give us Feedback')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
