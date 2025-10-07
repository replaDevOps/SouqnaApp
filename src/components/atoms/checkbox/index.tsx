import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

type IProps = {
  label?: string | number;
  checked?: boolean;
  children?: React.ReactNode;
  onPress: () => void;
  containerStyle: {};
  iconColor?: string;
};
export const Checkbox = (props: IProps) => {
  const {checked, onPress, containerStyle, iconColor = colors.primary} = props;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: checked ? colors.green : colors.white,
          borderWidth: checked ? 0 : 1,
        },
        containerStyle,
      ]}
      onPress={onPress}></TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.black,
    borderRadius: mvs(4),
    height: mvs(24),
    width: mvs(24),
    margin: mvs(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
