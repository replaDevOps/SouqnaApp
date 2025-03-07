import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notificationContainer: {
    padding: mvs(16),
    marginTop: mvs(10),
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: mvs(8),
    padding: mvs(12),
    marginBottom: mvs(16),
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: mvs(2)},
    shadowOpacity: 0.1,
    shadowRadius: mvs(3),
  },
  notificationTextContainer: {
    flex: 1,
    paddingLeft: mvs(12),
  },
  notificationTitle: {
    fontWeight: 'bold',
    color: colors.green,
    fontSize: mvs(16),
  },
  notificationText: {
    fontSize: mvs(14),
    color: colors.green,
    marginTop: mvs(4),
  },
  notificationIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: mvs(8),
  },
});
export default styles;
