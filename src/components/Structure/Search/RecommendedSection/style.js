import {StyleSheet} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.white,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // Recommended Section Styles
  recommendedContainer: {
    marginTop: mvs(10),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(10),
    // backgroundColor: colors.white,
  },
  recommendedItem: {
    flex: 1, // Allow each item to take equal space
    marginBottom: mvs(10),
    padding: mvs(8),
    marginHorizontal: 5,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  recommendedImage: {
    width: '100%',
    height: mvs(120),
    borderRadius: mvs(8),
    resizeMode: 'cover',
    marginBottom: mvs(8),
  },
  recommendedTextContainer: {
    paddingHorizontal: mvs(5),
  },
  recommendedLocation: {
    fontSize: mvs(10),
    color: colors.grey,
    marginBottom: mvs(2),
  },
  recommendedTitle: {
    fontSize: mvs(12),
    color: colors.black,
    marginBottom: mvs(2),
  },
  recommendedPrice: {
    fontSize: mvs(10),
    color: colors.green,
    fontWeight: 'bold',
  },
  // Heart Icon Styles
  heartIconContainer: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: mvs(20),
    padding: mvs(5),
  },
  endOfResultsText: {
    textAlign: 'center',
  },
});
export default styles;
