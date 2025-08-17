import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

const CustomText: React.FC<TextProps> = ({ style, children, ...rest }) => {
  const fontFamily = 'Amiri-Regular';

  return (
    <Text {...rest} style={[{ fontFamily }, style as TextStyle]}>
      {children}
    </Text>
  );
};

export default CustomText;
