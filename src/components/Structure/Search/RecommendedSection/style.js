import {Dimensions, StyleSheet} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const {width} = Dimensions.get('window');
// const imageWidth = width * 0.4;
const cardWidth = (width - mvs(45)) / 2;

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
  recommendedText: {
    fontSize: mvs(18),
    color: '#333',
    paddingHorizontal: mvs(6),
    lineHeight: mvs(16),
  },
  // Recommended Section Styles
  recommendedContainer: {
    // marginTop: mvs(10),
    paddingHorizontal: mvs(10),
    // paddingVertical: mvs(10),
    paddingBottom: mvs(10),
    overflow: 'visible',
    // elevation: 2,
    // backgroundColor: colors.white,
  },
  recommendedItem: {
    width: cardWidth,
    marginHorizontal: mvs(8),
    marginBottom: mvs(13),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    elevation: 3, // Add this for Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginVertical: mvs(4),
  },
  recommendedTextContainer: {
    flexDirection: 'column',
    // elevation: 3,
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
    fontSize: mvs(14),
    // fontWeight: 'bold',
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
