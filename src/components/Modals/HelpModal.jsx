import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {
  CloseSvg,
  HelpSVG,
  LockSVG,
  StarSVG,
  SunSVG,
  TrashSVG,
} from '../../assets/svg';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import Regular from '../../typography/RegularText';
import {useNavigation} from '@react-navigation/native';

const HelpModal = ({visible, onClose}) => {
  const navigation = useNavigation();
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Regular style={styles.closeText}>Close</Regular>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                ToastAndroid.show('Search History Deleted', ToastAndroid.SHORT);
              }}>
              <TrashSVG width={24} height={24} />
              <Regular style={styles.menuText}>Delete Search History</Regular>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Data');
              }}>
              <LockSVG width={24} height={24} />
              <Text style={styles.menuText}>Data Protection</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Design');
              }}>
              <SunSVG width={24} height={24} />
              <Text style={styles.menuText}>Design</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('About');
              }}>
              <StarSVG width={24} height={24} />
              <Text style={styles.menuText}>About Souqna</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate('Help');
              }}>
              <HelpSVG width={24} height={24} />
              <Text style={styles.menuText}>Help and Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  modalContainer: {
    backgroundColor: colors.white,
    paddingTop: mvs(20),
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: mvs(10),
    marginBottom: mvs(10),
  },
  title: {
    fontSize: mvs(20),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    flex: 1,
  },
  closeText: {
    fontSize: mvs(16),
    color: colors.green,
  },
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: mvs(10),
  },
  menuItem: {
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: colors.grey,
  },
  menuText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
    color: colors.black,
  },
});

export default HelpModal;
