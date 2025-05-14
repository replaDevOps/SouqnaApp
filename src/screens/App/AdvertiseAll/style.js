import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingHorizontal: mvs(16),
    paddingVertical: mvs(10),
    backgroundColor: '#f9f9f9',
    marginBottom: mvs(10),
  },
  header: {
    fontSize: mvs(16),
    fontWeight: 'bold',
    color: colors.grey,
  },
  content: {
    paddingHorizontal: mvs(16),
    paddingBottom: mvs(20),
  },
  subCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: mvs(12),
    paddingVertical: mvs(12),
    paddingHorizontal: mvs(16),
    marginBottom: mvs(12),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1, // Android shadow
  },
  subCategoryLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  subCategoryText: {
    fontSize: mvs(15),
    color: '#333',
  },
});

export default styles;
