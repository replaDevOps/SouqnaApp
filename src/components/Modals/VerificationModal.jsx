import React from 'react';
import {Modal, View, TouchableOpacity} from 'react-native';
import styles from '../../screens/Auth/Verification/styles';
import Regular from '../../typography/RegularText';
import {CloseSvg, VerifySVG} from '../../assets/svg';
import { useTranslation } from 'react-i18next';

const VerificationModal = ({visible, onVerify, onSkip, onClose}) => {
  const {t} = useTranslation();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onSkip}>
            {/* <Regular style={styles.modalCloseText}>X</Regular> */}
            <CloseSvg />
          </TouchableOpacity>

          <View style={styles.svgBackground}>
            <VerifySVG style={{marginBottom: 10}} />
          </View>
          <Regular style={styles.modalText}>
            {t('verifyProfileNow')}
          </Regular>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={onVerify}>
              <Regular style={styles.modalButtonText}>{t('Verify')}</Regular>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerificationModal;
