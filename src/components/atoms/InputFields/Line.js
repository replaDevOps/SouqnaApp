import {View} from 'react-native';
import React from 'react';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';
const Line = ({marginVertical = 0, bgColor = colors.grey, height = 0.5}) => {
  return (
    <View
      style={{
        backgroundColor: bgColor,
        height: mvs(height),
        marginVertical: mvs(marginVertical),
      }}
    />
  );
};
export default Line;
