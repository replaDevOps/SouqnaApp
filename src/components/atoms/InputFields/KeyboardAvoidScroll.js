import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

export const KeyboardAvoidScrollview = props => {
  const {
    children,
    contentContainerStyle,
    keyboardShouldPersistTaps = 'never',
  } = props;
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      contentContainerStyle={[
        styles.contentContainerStyle,
        contentContainerStyle,
      ]}>
      {children}
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: mvs(30),
    backgroundColor: colors.white,
  },
});
