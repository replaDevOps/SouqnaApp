import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import i18n from '../i18n/i18n';

const CustomText: React.FC<TextProps> = ({ style, children, ...rest }) => {
  const fontFamily = i18n.language === 'ar' ? 'Asal' : 'System';

  return (
    <Text {...rest} style={[{ fontFamily }, style as TextStyle]}>
      {children}
    </Text>
  );
};

export default CustomText;
