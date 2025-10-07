import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {BackSVG} from '../../assets/svg';
import CustomText from '../CustomText';

const ModalHeader = ({title, onBack, backText = 'Back'}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <BackSVG width={mvs(24)} height={mvs(24)} />
        <CustomText style={styles.backText}>{backText}</CustomText>
      </TouchableOpacity>
      <CustomText style={styles.title}>{title}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: mvs(16),
    height: mvs(60),
    backgroundColor: colors.lightgreen,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: mvs(16),
  },
  backText: {
    fontSize: mvs(16),
    color: colors.green,
    marginLeft: mvs(8),
  },
  title: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
});

export default ModalHeader;
