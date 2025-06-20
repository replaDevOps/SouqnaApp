import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { mvs } from '../../../util/metrices';
import { colors } from '../../../util/color';

const {width} = Dimensions.get('window');
// const imageWidth = width * 0.4;
const cardWidth = (width - mvs(45)) / 2;
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  list: {padding: 10},
  card: {
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  heart: {
    marginLeft: 10,
  },
  location: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedText: {
    fontSize: mvs(18),
  },
  // Recommended Section Styles
  recommendedContainer: {
    marginTop: mvs(20),
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
  noListingsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noListingsText: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.grey,
  },
});


export default styles;

export const adjustModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Bottom sheet style
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  closeText: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});


