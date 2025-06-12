import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {mvs} from '../../../util/metrices';

const CustomSwitch = ({value, onValueChange, trackColor, thumbColor}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: mvs(5),
        backgroundColor: value ? trackColor.true : trackColor.false,
        borderRadius: mvs(20),
        width: mvs(50),
        height: mvs(30),
        justifyContent: value ? 'flex-end' : 'flex-start',
        position: 'relative',
      }}
      onPress={() => onValueChange(!value)}>
      <View
        style={{
          width: mvs(20),
          height: mvs(20),
          borderRadius: mvs(10),
          backgroundColor: thumbColor,
        }}
      />
    </TouchableOpacity>
  );
};

export default CustomSwitch;
