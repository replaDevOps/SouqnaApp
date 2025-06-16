import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {BackSVG} from '../../assets/svg';
const CategoryHeader = ({title, onBack, backText = ''}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <BackSVG width={mvs(24)} height={mvs(24)} />
        <Text style={styles.backText}>{backText}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: mvs(10),
    height: mvs(60),
    backgroundColor: colors.lightgreen,
    borderBottomWidth: mvs(1),
    borderBottomColor: colors.gray,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: mvs(16),
  },
  backText: {
    fontSize: mvs(14),
    color: colors.white,
    marginLeft: mvs(4),
  },
  title: {
    fontSize: mvs(16),
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
});

export default CategoryHeader;
