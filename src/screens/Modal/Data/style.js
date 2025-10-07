import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: mvs(10),
    backgroundColor: colors.white,
  },
  menuItem: {
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomColor: colors.grey,
  },
  menuText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
    color: colors.black,
  },
});

export default styles;
