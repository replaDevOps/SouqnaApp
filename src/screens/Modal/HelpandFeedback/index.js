import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ModalHeader from '../../../components/Headers/ModalHeader';
import {OpenSVG} from '../../../assets/svg';
import styles from './style';

const HelpScreen = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };
  return (
    <View>
      <ModalHeader title="Help and Feedback" onBack={handleBack} />
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            openUrl('https://hilfe.kleinanzeigen.de/hc/de');
          }}>
          <Text style={styles.menuText}>Help Area</Text>
          <OpenSVG width={20} height={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuText}>Report a Problem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
          <Text style={styles.menuText}>Give us Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HelpScreen;
