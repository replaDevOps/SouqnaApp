import React, { JSX } from 'react';
import { ColorValue, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '../util/color';
import { mvs } from '../util/metrices';
import fonts from '../assets/fonts';
import CustomText from '../components/CustomText';
import i18n from '../i18n/i18n';
type FcProps = {
  label?: string | number;
  numberOfLines?: number;
  fontSize?: number;
  color?: ColorValue | undefined;
  onPress?: (() => void) | undefined;
  style?: StyleProp<TextStyle>;
  children?: JSX.Element | JSX.Element[] | null;
};
const Regular: React.FC<FcProps> = ({
  label,
  fontSize = 14,
  color = colors.black,
  numberOfLines,
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
export default Regular;
const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.regular,
    fontSize: mvs(12),
  },
});
