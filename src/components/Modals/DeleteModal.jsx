import {Modal, View, StyleSheet, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {useTranslation} from 'react-i18next';
import {deleteAccount} from '../../api/apiServices';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

export const DeleteModal = ({visible, onClose}) => {
  const {t} = useTranslation();

  const navigation = useNavigation();

  const {token} = useSelector(state => state.user);

  const handleAccountDeletion = async () => {
    const response = await deleteAccount(token);
    console.log('account deletion response', JSON.stringify(response, null, 4));
    onClose();
    navigation.replace('Login');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={{alignSelf: 'flex-end', padding: 8}}
            onPress={onClose}>
            <Ionicons name="close-circle" size={28} color={colors.red1} />
          </TouchableOpacity>

          <View style={styles.svgContainer}>
            <Ionicons name="alert-circle" size={70} color={colors.red1} />
          </View>

          <CustomText style={styles.text}>
            {t('accountWillBeDeleted')}
          </CustomText>
          <CustomText style={styles.text2}>
            {t('confirmDeleteAccount')}
          </CustomText>

          <View style={{marginTop: 10, width: '100%', alignSelf: 'center'}}>
            <TouchableOpacity
              style={styles.redButton}
              onPress={handleAccountDeletion}>
              <CustomText style={styles.buttonText}>
                {t('deleteAccount')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 15,
    paddingVertical: 18,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  image1: {
    width: 30,
    height: 30,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
  },
  text2: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
    fontWeight: '400',
  },
  svgContainer: {
    // marginBottom: 15,
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  redButton: {
    backgroundColor: colors.red1,
    padding: mvs(16),
    borderRadius: mvs(12),
    marginTop: mvs(16),
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
});

export default DeleteModal;
