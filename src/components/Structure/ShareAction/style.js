import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const style = StyleSheet.create({
  shareContainer: {
    backgroundColor: colors.white,
    paddingVertical: mvs(10),
    marginTop: mvs(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareTitle: {
    fontSize: mvs(14),
    marginBottom: mvs(10),
  },
  shareIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    marginHorizontal: mvs(15),
  },
});

export default style;
