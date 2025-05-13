import {StatusBar, StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  Scrollcontainer: {
    // flex: 1,
    // paddingBottom: 40,
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    paddingVertical: mvs(45),
  },
  logoContainer: {
    marginVertical: mvs(20),
    alignSelf: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: mvs(20),
  },
  footer: {
    padding: mvs(16),
  },
  buttonSpacing: {
    marginVertical: mvs(10),
  },
  menuContainer: {
    // justifyContent: 'center',
    marginVertical: mvs(10),
    marginHorizontal: mvs(17),
  },
  menuItem: {
    backgroundColor: colors.gray,
    paddingVertical: mvs(15),
    marginVertical: mvs(6),
    borderRadius: mvs(22),
    paddingHorizontal: mvs(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  regularText: {
    fontSize: mvs(24),
    fontWeight: 'bold',
    color: colors.black,
    paddingLeft: mvs(20),
    paddingTop: mvs(10),
  },
  regularText1: {
    fontSize: mvs(18),
    paddingBottom: mvs(10),
  },
  menuText: {
    fontSize: mvs(17),
    fontWeight: 'bold',
    marginLeft: mvs(10),
    color: colors.black,
  },
  radioCircle: {
    width: mvs(16),
    height: mvs(16),
    borderRadius: mvs(10),
    borderWidth: 2,
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
  // New styles added from inline styles
  verificationCapsule: {
    backgroundColor: colors.lightpastelgreen,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  unverifiedCapsule: {
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  statusDot: {
    height: 8,
    width: 8,
    marginRight: 5,
    borderRadius: 4,
  },
  verificationLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  verificationLabel: {
    fontSize: 13,
    textAlign: 'center',
    flex: 1,
  },
  verificationTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  stepCircle: {
    borderRadius: 20,
    borderWidth: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  stepCircleInProgress: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
  },
  stepNumber: {
    fontSize: 20,
  },
  connectingLine: {
    width: '23%',
    height: 4,
    borderRadius: 2,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: mvs(10),
    paddingHorizontal: mvs(10),
    backgroundColor: colors.gray,
    // elevation:8,
    borderRadius: mvs(20),
    marginBottom: mvs(10),
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#fff',
    width: mvs(37),
    height: mvs(37),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: mvs(8),
  },
  // menuText: {
  //   marginLeft: mvs(10),
  //   color: colors.black,
  //   fontSize: mvs(14),
  //   fontWeight: 'bold',
  // },
});

export default styles;
