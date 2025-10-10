import {StyleSheet, Platform} from 'react-native';
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
    justifyContent: 'space-between',
    marginBottom: mvs(5),
    paddingHorizontal: mvs(2),
  },

  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(20),
    paddingHorizontal: mvs(2),
  },

  bigCard: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '48%',
    height: mvs(190),
    paddingVertical: mvs(10),
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    // iOS Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  smallCard: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '23%',
    height: mvs(115),
    paddingVertical: mvs(8),
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    // iOS Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  bigIcon: {
    width: mvs(140),
    height: mvs(140),
    resizeMode: 'contain',
  },

  smallIcon: {
    width: mvs(70),
    height: mvs(70),
    resizeMode: 'contain',
  },

  categoryText: {
    fontWeight: '500',
    textAlign: 'center',
    color: colors.black,
    lineHeight: Platform.OS === 'ios' ? mvs(25) : mvs(16),
    paddingHorizontal: mvs(4),
    marginTop: mvs(4),
  },
});

export default styles;
