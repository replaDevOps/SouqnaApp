import { StyleSheet } from 'react-native';
import { mvs } from '../../../../util/metrices';
import { colors } from '../../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Recommended Section Styles
  recommendedContainer: {
    marginTop: mvs(10),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(10),
    overflow:'visible'
    // backgroundColor: colors.white,
  },
  recommendedItem: {
    flex: 1, // Allow each item to take equal space
    marginHorizontal: mvs(8),
    marginBottom: mvs(13),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    // padding: mvs(4),
  },
  recommendedImage: {
    width: '100%',
    height: mvs(130),
    resizeMode: 'cover',
    borderTopLeftRadius: mvs(10),
    borderTopRightRadius: mvs(10),
    // marginBottom: mvs(8),
  },
  recommendedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:mvs(4)
  },
  recommendedTextContainer: {
    flexDirection: 'column',
    elevation: 3,
    paddingVertical: mvs(6),
    paddingHorizontal: mvs(6),
  },
  recommendedLocation: {
    fontSize: mvs(12),
    color: colors.grey,
    marginLeft: mvs(2),
    flexWrap: 'wrap',
  },
  recommendedTitle: {
    fontSize: mvs(15),
    fontWeight: 'bold',
  },
  recommendedPrice: {
    fontSize: mvs(15),
    fontWeight: '400',
    color: colors.green,
    paddingTop: mvs(4),
  },

  // Heart Icon Styles
  heartIconContainer: {
    position: 'absolute',
    top: 7,
    right: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: mvs(20),
    padding: mvs(5),
  },

  endOfResultsText: {
    textAlign: 'center',
  },
});

export default styles;
