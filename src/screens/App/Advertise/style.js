import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: mvs(20),
    marginTop: mvs(10),
  },
  regularText: {
    fontSize: mvs(16),
    color: colors.grey,
    // marginVertical: mvs(10),
    marginTop: mvs(20),
  },
  menuContainer: {
    justifyContent: 'center',
    marginBottom: mvs(10),
    backgroundColor: colors.white,
  },
  categoryItem: {
    alignItems: 'center',
    left: mvs(30),
    justifyContent: 'center',
    width: mvs(70),
    marginBottom: mvs(10),
  },
  IconContainer: {
    padding: mvs(10),
    marginLeft: mvs(10),
    borderRadius: mvs(8),
    backgroundColor: colors.lightgreen,
  },
  textContainer: {
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  categoryText: {
    marginLeft: mvs(15),
    fontSize: mvs(16),
    color: colors.black,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%', // This ensures it takes the full width of the parent container
    alignItems: 'center', // Center vertically
  },
  categoryContainer: {
    marginTop: mvs(10),
    paddingTop: mvs(10),
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-evenly',
  },

  otherCategoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: mvs(10),
    marginTop: mvs(10),
    backgroundColor: colors.lightGray,
  },
  otherCategoriesText: {
    fontSize: mvs(18),
    marginLeft: mvs(10),
    color: colors.black,
  },
  categoryList: {
    paddingTop: mvs(10),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(10),
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
