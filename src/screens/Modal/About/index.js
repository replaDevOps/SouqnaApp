import {Linking, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {OpenSVG} from '../../../assets/svg';
import styles from './style';

const AboutScreen = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  const openUrl = url => {
    Linking.openURL(url);
  };
  return (
    <View>
      <ModalHeader title="About Souqna" onBack={handleBack} />
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://www.kleinanzeigen.de/impressum.html');
          }}>
          <Text style={styles.menuText}>Imprint</Text>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://themen.kleinanzeigen.de/careers/');
          }}>
          <Text style={styles.menuText}>Career Page</Text>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AboutScreen;
