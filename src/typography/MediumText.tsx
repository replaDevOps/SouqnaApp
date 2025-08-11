import React from 'react';
import { ColorValue, StyleProp, StyleSheet, TextStyle } from 'react-native';
import { mvs } from '../util/metrices';
import { colors } from '../util/color';
import CustomText from '../components/CustomText';
import fonts from '../assets/fonts';
import i18n from '../i18n/i18n';
type FcProps = {
  label?: string | number;
  numberOfLines?: number;
  fontSize?: number;
  color?: ColorValue | undefined;
  onPress?: (() => void) | undefined;
  style?: StyleProp<TextStyle>;
  children?: any;
};
const Medium: React.FC<FcProps> = ({
  label,
  fontSize,
  color,
  numberOfLines = 1,
  children,
  style,
  ...props
}) => {
  const fontFamily = i18n.language === 'ar' ? 'Asal' : 'System';
  return (
    <CustomText
      numberOfLines={numberOfLines}
      {...props}
      style={[{ ...styles.label, color: color, fontSize: fontSize, fontFamily }, style]}>
      {label}
      {children}
    </CustomText>
  );
};
export default Medium;
const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.medium,
    fontSize: mvs(16),
    color: colors.gray,
  },
});
