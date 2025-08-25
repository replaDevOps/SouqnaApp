import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import i18n from '../../../i18n/i18n';
type props = {
  style?: StyleProp<ViewStyle>;
  children?: JSX.Element | JSX.Element[];
};
export const Row = (props: props) => {
  const isArabic = i18n.language === 'ar';
  const { children, style } = props;
  return <View style={[styles(isArabic).contentContainerStyle, style]}>{children}</View>;
};
const styles = (isArabic: boolean) => StyleSheet.create({
  contentContainerStyle: {
    flexDirection: isArabic ? 'row' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
