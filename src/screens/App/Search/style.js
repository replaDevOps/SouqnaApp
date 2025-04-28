import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  productContainer: {
    padding: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
  },
  container: {
    flex: 1,
    // paddingBottom: mvs(40),
  },
  categoryContainer: {
    marginTop: mvs(10),
    paddingTop: mvs(10),
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-evenly',
  },
  categoryItem: {
    alignItems: 'center',
    left: mvs(30),
    justifyContent: 'center',
    width: mvs(70),
    marginBottom: mvs(10),
  },
  IconContainer: {
    padding: 10,
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
    marginTop: mvs(8),
    fontSize: mvs(10),
    color: colors.black,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },

  // Gallery Section Styles
  galleryContainer: {
    marginTop: mvs(10),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(10),
    backgroundColor: colors.white,
  },
  content: {
    backgroundColor: colors.white,
  },
  // title: {
  //   fontSize: mvs(13),
  // },
  productItem: {
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    marginRight: mvs(10),
    width: mvs(120),
    marginBottom: mvs(10),
  },
  productImage: {
    borderRadius: mvs(8),
    width: mvs(100),
    height: mvs(100),
    resizeMode: 'contain',
    marginRight: 'auto',
  },
  productTitle: {
    fontSize: mvs(12),
    color: colors.black,
    marginRight: 'auto',
    marginBottom: mvs(4),
  },
  productPrice: {
    fontSize: mvs(10),
    color: colors.green,
    marginRight: 'auto',
    textAlign: 'left',
    fontWeight: 'bold',
  },

  // Recommended Section Styles
  recommendedContainer: {
    marginTop: mvs(10),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(10),
    backgroundColor: colors.white,
  },
  recommendedItem: {
    flex: 1, // Allow each item to take equal space
    marginBottom: mvs(10),
    padding: mvs(8),
  },
  recommendedImage: {
    width: '100%', // Full width for the image
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Transparent circle background
    borderRadius: mvs(20), // Circular shape
    padding: mvs(5),
  },
  endOfResultsText: {
    textAlign: 'center',
  },
});

export default styles;
