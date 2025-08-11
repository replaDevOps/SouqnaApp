import {StyleSheet} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: mvs(10),
    marginHorizontal: mvs(15),
    flexDirection: 'column',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: mvs(20),
  },

  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: mvs(20),
  },

  bigCard: {
    alignItems: 'center',
    width: '48%',
    paddingVertical: mvs(10),
  },

  smallCard: {
    alignItems: 'center',
    width: '23%',
    paddingVertical: mvs(8),
  },

  bigIcon: {
    width: '100%',
    height: mvs(80),
    // flex: 1,
    // contain: 'cover',
    marginBottom: mvs(10),
    resizeMode: 'contain',
    // borderRadius: mvs(30),
    // backgroundColor: colors.lightorange,
  },

  smallIcon: {
    width: '100%',
    height: mvs(50),
    marginBottom: mvs(8),
    resizeMode: 'contain',
    // borderRadius: mvs(25),
    // backgroundColor: colors.lightorange,
  },

  categoryText: {
    fontSize: mvs(13),
    fontWeight: '500',
    textAlign: 'center',
    color: colors.black,
    lineHeight: mvs(16),
  },

  // Legacy styles (kept for compatibility)
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: mvs(75),
  },
  IconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: mvs(55),
    height: mvs(55),
    borderRadius: mvs(27),
    backgroundColor: colors.lightorange,
  },
  textContainer: {
    width: mvs(65),
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
});

export default styles;
