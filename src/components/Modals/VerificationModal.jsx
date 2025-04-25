import React from 'react';
import {Modal, View, TouchableOpacity} from 'react-native';
import styles from '../../screens/Auth/Verification/styles';
import Regular from '../../typography/RegularText';
import {CloseSvg, VerifySVG} from '../../assets/svg';

const VerificationModal = ({visible, onVerify, onSkip, onClose}) => {
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
            Would you like to verify your profile now?
          </Regular>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={onVerify}>
              <Regular style={styles.modalButtonText}>Verify</Regular>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerificationModal;
