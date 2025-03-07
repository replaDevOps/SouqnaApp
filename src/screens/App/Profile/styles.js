import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logoContainer: {
    marginVertical: mvs(20),
    alignSelf: 'center',
  },
  content: {marginBottom: mvs(20)},
  footer: {
    // justifyContent: 'flex-end',
    padding: mvs(16),
  },
  buttonSpacing: {
    marginVertical: mvs(10), // Adjust this value for spacing between buttons
  },
  menuContainer: {
    justifyContent: 'center',
    paddingHorizontal: mvs(10),
    marginVertical: mvs(10),
    backgroundColor: colors.white,
  },
  menuItem: {
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    flexDirection: 'row',
    borderBottomColor: colors.grey,
  },
  regularText: {
    fontSize: mvs(18),
    color: colors.green,
    paddingLeft: mvs(20),
    paddingTop: mvs(10),
  },
  regularText1: {
    fontSize: 16,
    // paddingLeft: mvs(20),
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
    // marginLeft: 'auto',
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
