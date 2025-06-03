// EnhancedLocationSelector.js (Parent Component)
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import {mvs} from '../../util/metrices';
// import {CloseSvg, SearchSVG} from '../assets/svg';
import {  CloseSvg, SearchSVG } from '../../assets/svg';
import {colors} from '../../util/color';
import LocationModal from './LocationModal';

const EnhancedLocationSelector = ({
  onPlaceSelected,
  initialValue = '',
  placeholder = 'Enter Location.....',
}) => {
  const [text, setText] = useState(initialValue);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleLocationSelected = (locationData) => {
    setText(locationData.location);
    onPlaceSelected(locationData);
    closeModal();
  };

  const clearLocation = () => {
    setText('');
    onPlaceSelected({location: '', lat: '', long: ''});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.textInputContainer} onPress={openModal}>
        <View style={styles.leftButton}>
          <SearchSVG width={25} height={25} />
        </View>
        <Text style={[styles.placeholderText, text && styles.selectedText]}>
          {text || placeholder}
        </Text>
        {text.length > 0 && (
          <TouchableOpacity onPress={clearLocation}>
            <CloseSvg width={16} height={16} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet">
        <LocationModal
          onLocationSelected={handleLocationSelected}
          onClose={closeModal}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 50,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(5),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(5),
    minHeight: mvs(50),
  },
  leftButton: {
    height: mvs(40),
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: colors.grey,
    paddingRight: mvs(10),
  },
  placeholderText: {
    flex: 1,
    marginLeft: mvs(5),
    fontSize: mvs(16),
    color: colors.grey,
  },
  selectedText: {
    color: colors.black,
  },
});

export default EnhancedLocationSelector;