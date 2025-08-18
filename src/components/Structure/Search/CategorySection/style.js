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
    marginBottom: mvs(5),
  },

  row1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: mvs(20),
  },

  // Enhanced shadow styles
  cardShadow: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    // iOS Shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Android Shadow
    elevation: 8,
  },

  // Alternative deeper shadow for emphasis
  cardShadowDeep: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    // iOS Shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    // Android Shadow
    elevation: 12,
  },

  bigCard: {
    alignItems: 'center',
    width: '48%',
    height: mvs(190),
    paddingVertical: mvs(10),
    ...StyleSheet.create({
      shadow: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      },
    }).shadow,
  },

  smallCard: {
    alignItems: 'center',
    width: '23%',
    height: mvs(115),
    paddingVertical: mvs(8),
    ...StyleSheet.create({
      shadow: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
      },
    }).shadow,
  },

  bigIcon: {
    width: mvs(140),
    height: mvs(140),
    // marginBottom: mvs(5),
    resizeMode: 'contain',
  },

  smallIcon: {
    width: mvs(75),
    height: mvs(75),
    marginBottom: mvs(8),
    resizeMode: 'contain',
  },

  categoryText: {
    // fontSize: mvs(13),
    fontWeight: '500',
    textAlign: 'center',
    color: colors.black,
    lineHeight: mvs(25),
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
