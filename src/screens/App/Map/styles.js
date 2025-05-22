import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { mvs } from '../../../util/metrices';
import { colors } from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BottomContainer: {
    borderTopColor: colors.grey,
    borderTopWidth: 1,
    position: 'absolute',
    padding: mvs(8),
    bottom: 0,
    backgroundColor: '#fff',
    width: '100%',
    zIndex: 50,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myLocationButton: {
    position: 'absolute',
    // bottom: mvs(110),
    right: mvs(18),
    backgroundColor: colors.lightgreen,
    width: mvs(60),
    height: mvs(60),
    borderRadius: mvs(30),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 60,
  },
  loadingIndicator: {
    position: 'absolute',
    width: mvs(48),
    height: mvs(48),
    borderRadius: mvs(24),
    borderWidth: 2,
    borderColor: colors.primary,
    borderTopColor: 'transparent',
    backgroundColor: 'transparent',
    transform: [{ rotate: '45deg' }],
    opacity: 0.7,
  },
  productDetailContainer: {
    backgroundColor: colors.white,
    // borderRadius: mvs(10),
    flexDirection: 'row',
    paddingVertical: mvs(5),
    paddingHorizontal: mvs(5),
  },
  productImageContainer: {
    width: mvs(80),
    height: mvs(80),
    borderRadius: mvs(8),
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  noImagePlaceholder: {
    backgroundColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: mvs(10),
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: mvs(16),
    fontWeight: 'bold',
    color: colors.black,
  },
  productLocation: {
    fontSize: mvs(14),
    color: colors.darkGrey,
  },
  priceTagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.primary,
  },
  conditionTag: {
    fontSize: mvs(12),
    color: colors.darkGrey,
    backgroundColor: colors.lightGrey,
    paddingHorizontal: mvs(6),
    paddingVertical: mvs(2),
    borderRadius: mvs(4),
  },
  closeButton: {
    position: 'absolute',
    top: mvs(5),
    right: mvs(5),
    width: mvs(24),
    height: mvs(24),
    borderRadius: mvs(12),
    backgroundColor: colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: mvs(16),
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutPrice: {
    color: 'green',
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
  },
  categoryListContainer: {},

  categoryItem: {
    alignItems: 'center',
    paddingTop: 8,
    //   marginVertical: 6,
    backgroundColor: '#ffffff',
    //   borderRadius: 8,
    borderEndWidth: 1,
    borderColor: colors.grey,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },

  categoryText: {
    paddingHorizontal: 12,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  simpleDropdownContainer: {
    position: 'absolute',
    top: 110, // Position below header
    left: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    width: '55%',
    maxHeight: 650, // Add this to make it scrollable
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: colors.grey,
  },

  // Keep these existing styles
  dropdownButton: {
    padding: 14,
    left: 0,
    marginTop: mvs(3),
    position: 'absolute',
    zIndex: 80,
    width: '35%',
    backgroundColor: colors.lightorange,
    borderRadius: mvs(8),
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    width: '90%'
  },
  productGroupContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    maxHeight: 220, // Height to accommodate product cards and header
  },

  productGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },

  productGroupTitle: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.dark,
  },

  productCardContainer: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: 200, // Fixed width for each card
    height: 160,
  },

  productImageContainer: {
    width: '75%',
    height: 80,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productInfo: {
    flex: 1,
  },

  productTitle: {
    fontSize: mvs(14),
    fontWeight: 'bold',
    marginBottom: 4,
  },

  productLocation: {
    fontSize: mvs(12),
    color: '#666',
    marginBottom: 4,
  },

  priceTagContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceTag: {
    fontSize: mvs(14),
    fontWeight: 'bold',
    color: colors.lightgreen,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 90, // Lower than dropdown (100) but higher than other content
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModal: {
    width: '30%',
    height: 70,
    flexDirection:'row',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
});

export default styles;
