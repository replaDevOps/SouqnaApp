import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices'; // Assuming this scales the values
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensures that footer stays at the bottom
  },
  scrollContent: {
    paddingBottom: mvs(60), // Adjust this value to prevent overlap with the footer
  },
  imageContainer: {
    marginBottom: mvs(10),
  },
  productImage: {
    resizeMode: 'cover',
  },
  itemContainer: {
    padding: mvs(10),
    backgroundColor: colors.white,
    marginBottom: mvs(10),
  },
  productTitle: {
    fontSize: mvs(22),
  },
  productPrice: {
    fontSize: mvs(20),
    color: colors.green,
    marginVertical: 5,
  },
  productLocation: {
    fontSize: mvs(16),
    color: colors.grey,
  },

  descriptionContainer: {
    justifyContent: 'center',
    padding: mvs(10),
    backgroundColor: colors.white,
    marginTop: mvs(10),
  },

  providerContainer: {
    // justifyContent: 'center',
    padding: mvs(10),
    backgroundColor: colors.white,
    marginTop: mvs(10),
  },

  providerTitle: {
    fontSize: mvs(16),
  },
  providerName: {
    marginVertical: mvs(10),
    fontSize: mvs(14),
  },
  display: {
    color: colors.grey,
  },
  attributes: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingHorizontal: mvs(10),
    marginVertical: mvs(10),
  },
  attributeBox: {
    backgroundColor: colors.lightpurple,
    borderRadius: mvs(15),
    paddingVertical: mvs(2),
    paddingHorizontal: mvs(15),
    marginRight: mvs(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  attributeBox1: {
    backgroundColor: '#E0BBE4',
    borderRadius: mvs(15),
    paddingVertical: mvs(2),
    paddingHorizontal: mvs(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: mvs(216),
    // marginLeft: mvs(16),
    flexWrap: 'wrap',
  },
  attributeText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
  },
  icon: {
    marginRight: mvs(10),
  },
});

export default styles;
