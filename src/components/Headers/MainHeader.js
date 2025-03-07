import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {CloseSvg} from '../../assets/svg'; // Assuming CloseSvg is an SVG component
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';

const MainHeader = ({title, showCloseIcon = false, onClose}) => {
  const [isCloseVisible, setIsCloseVisible] = useState(showCloseIcon);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setIsCloseVisible(false);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {isCloseVisible && (
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <CloseSvg color={colors.green} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: mvs(60),
    backgroundColor: colors.lightgreen,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: mvs(20),
    color: colors.green,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    // padding: mvs(2),
    // marginLeft: 10, // Optional: Add margin if needed to avoid the icon being clipped
    // flexDirection: 'row', // Ensure layout is correct
  },
});

export default MainHeader;
