import React from 'react';
import {ColorValue, StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {mvs} from '../util/metrices';
import {colors} from '../util/color';
import fonts from '../assets/fonts';
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
  return (
    <Text
      numberOfLines={numberOfLines}
      {...props}
      style={[{...styles.label, color: color, fontSize: fontSize}, style]}>
      {label}
      {children}
    </Text>
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
