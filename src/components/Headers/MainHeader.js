import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BackSVG, CloseSvg} from '../../assets/svg'; // Assuming CloseSvg is an SVG component
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../CustomText';

const MainHeader = ({
  title,
  showCloseIcon = false,
  showBackIcon = false,
  onClose,
}) => {
  const navigation = useNavigation();

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      {showBackIcon && (
        <TouchableOpacity onPress={handleBack} style={styles.leftIcon}>
          <BackSVG />
        </TouchableOpacity>
      )}

      <CustomText style={styles.title}>{title}</CustomText>

      {showCloseIcon && (
        <TouchableOpacity onPress={handleClose} style={styles.rightIcon}>
          <CloseSvg color={colors.green} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: mvs(60),
    backgroundColor: colors.lightgreen,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: mvs(20),
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{translateY: -12}],
  },
  rightIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{translateY: -12}],
  },
});

export default MainHeader;
