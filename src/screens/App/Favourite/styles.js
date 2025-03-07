import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: mvs(10),
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: mvs(10),
    backgroundColor: colors.lightGray,
    borderRadius: mvs(10),
    padding: mvs(10),
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: mvs(10),
    marginRight: mvs(10),
  },
  favoriteTextContainer: {
    flex: 1,
  },
  favoriteLocation: {
    fontSize: mvs(14),
    color: colors.grey,
  },
  favoriteTitle: {
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
  favoritePrice: {
    fontSize: mvs(14),
    color: colors.green,
  },
  heartIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: mvs(5),
  },
});

export default styles;
