import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BackSVG, CloseSvg} from '../../assets/svg'; // Assuming CloseSvg is an SVG component
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {useNavigation} from '@react-navigation/native';

const MainHeader = ({
  title,
  showCloseIcon = false,
  showBackIcon = false,
  onClose,
}) => {
  const navigation = useNavigation();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      {showBackIcon && (
        <TouchableOpacity onPress={handleBack} style={styles.closeButton}>
          <BackSVG />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {showCloseIcon && (
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
