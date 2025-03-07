import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import * as SVG from '../../../assets/svg';
import {Row} from '../row';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';
const PrimaryTextInput = ({
  leftIcon,
  rightIcon,
  placeholder = '',
  style,
  editable = true,
}) => {
  const LeftIcon = SVG[leftIcon];
  const RightIcon = SVG[rightIcon];

  const [counter, setCounter] = useState(0);
  return (
    <Row style={{...styles.main, ...style}}>
      <View>{LeftIcon ? <LeftIcon /> : null}</View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        editable={editable}
        placeholderTextColor={'lightgray'}></TextInput>
      {RightIcon ? <RightIcon width={20} /> : null}
    </Row>
  );
};
export default PrimaryTextInput;

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: mvs(10),
    paddingHorizontal: mvs(5),
    height: mvs(50),
    backgroundColor: colors.gray,
    elevation: 5,
    borderRadius: 5,
  },

  counter: {
    marginVertical: mvs(16),
    alignItems: 'center',
    padding: mvs(5),
  },
  input: {
    flex: 1,
    paddingLeft: mvs(10),
    color: colors.black,
  },
});
