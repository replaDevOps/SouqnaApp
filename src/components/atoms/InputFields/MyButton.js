import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';
import CustomText from '../../CustomText';
const MyButton = ({onPress, title, disabled, icon, widt, color, children}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled
            ? colors.lightpastelgreen
            : color || colors.lightgreen,
          opacity: disabled ? 0.6 : 1,
          height: 55,
          width: widt ? widt : '100%',
        },
      ]}
      onPress={onPress}
      disabled={disabled}>
      <View style={styles.view1}>
        {icon && <Image source={icon} style={styles.image1} />}
        {/* Conditionally render children (like ActivityIndicator) */}
        {children || <CustomText style={styles.text}>{title}</CustomText>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: mvs(20),
  },
  text: {
    fontSize: mvs(17),
    fontWeight: '400',
    color: colors.white,
    fontFamily: 'Amiri-Regular',
  },
  view1: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  image1: {
    width: 30,
    height: 30,
  },
});
export {MyButton};
