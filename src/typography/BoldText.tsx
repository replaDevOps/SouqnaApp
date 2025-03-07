import React from 'react';
import {ColorValue, StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {colors} from '../util/color';
import {mvs} from '../util/metrices';
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
const Bold: React.FC<FcProps> = ({
  label,
  fontSize,
  color = colors.black,
  numberOfLines,
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
export default Bold;
const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bold,
    fontWeight: 'bold',
    fontSize: mvs(15),
    color: colors.black, //default color
  },
});
