import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: mvs(10),
    backgroundColor: colors.white,
  },
  menuItem: {
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: colors.grey,
  },
  regularText: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    fontSize: 14,
    paddingBottom: mvs(10),
  },
  menuText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
    color: colors.black,
  },
  radioCircle: {
    width: mvs(16),
    height: mvs(16),
    borderRadius: mvs(10),
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: colors.green,
  },
  radioDot: {
    width: mvs(5),
    height: mvs(5),
    borderRadius: mvs(4),
    backgroundColor: colors.black,
  },
});

export default styles;
