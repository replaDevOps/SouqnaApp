import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  header: {
    fontSize: mvs(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: mvs(16),
  },
  newsList: {
    paddingVertical: 20,
  },
  newsItem: {
    flexDirection: 'row',
    marginBottom: mvs(16),
    backgroundColor: colors.white,
    borderRadius: mvs(8),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: mvs(0.2),
    shadowRadius: mvs(4),
    elevation: mvs(2),
    padding: mvs(12),
  },
  newsImage: {
    width: mvs(100),
    height: mvs(100),
    borderRadius: mvs(8),
    marginRight: mvs(12),
    resizeMode: 'contain',
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: mvs(18),
    color: colors.black,
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: colors.gray1,
  },
});
export default styles;
