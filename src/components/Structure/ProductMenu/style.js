import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: mvs(10),
    backgroundColor: colors.white,
  },
  menuItem: {
    paddingVertical: mvs(15),
    borderTopWidth: 1,
    flexDirection: 'row',
    borderTopColor: colors.grey,
  },
  topItem: {
    paddingVertical: mvs(15),
    flexDirection: 'row',
  },
  menuText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
    color: colors.grey,
  },
  leftText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
    color: colors.black,
  },
});
export default styles;
