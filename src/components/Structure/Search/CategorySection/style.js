import {StyleSheet} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: mvs(10),
    marginHorizontal:mvs(5),
    // paddingTop: mvs(10),
    // marginBottom: mvs(10),
    flexDirection: 'row',
    // backgroundColor: colors.white,
    // justifyContent: 'space-evenly',
  },
  categoryItem: {
    alignItems: 'center',
    // left: mvs(30),
    justifyContent: 'center',
    width: mvs(70),
    // marginBottom: mvs(10),
  },
  IconContainer: {
    // padding: 10,
    justifyContent:'center',
    alignItems:'center',
    width:mvs(55),
    height:mvs(55),
    borderRadius: mvs(27),
    backgroundColor: colors.lightorange,
  },
  textContainer: {
    width:mvs(60),
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  categoryText: {
    marginTop: mvs(8),
    fontSize: mvs(13),
    fontWeight:'400',
    color: colors.black,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
});

export default styles;
