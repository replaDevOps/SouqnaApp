import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: mvs(8),
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
    fontSize: mvs(15),
    marginLeft: mvs(10),
    color: '#000',
  },
  leftText: {
    fontSize: mvs(16),
    fontWeight: '700',
    marginLeft: mvs(10),
    color: colors.black,
  },
});
export default styles;
