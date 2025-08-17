// utils/fonts.js

import {Platform, TextStyle} from 'react-native';

export const getFontFamily = (weight = 'regular') => {
  if (Platform.OS === 'ios') {
    return {
      fontFamily: 'Amiri',
      fontWeight: weight === 'bold' ? TextStyle.bold : TextStyle.normal,
    };
  } else {
    return {
      fontFamily: weight === 'bold' ? 'Amiri-Bold' : 'Amiri-Regular',
      fontWeight: 'normal',
    };
  }
};
