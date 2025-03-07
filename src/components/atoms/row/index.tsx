import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
type props = {
  style?: StyleProp<ViewStyle>;
  children?: JSX.Element | JSX.Element[];
};
export const Row = (props: props) => {
  const {children, style} = props;
  return <View style={[styles.contentContainerStyle, style]}>{children}</View>;
};
const styles = StyleSheet.create({
  contentContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
