import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { mvs } from '../../util/metrices';
import { colors } from '../../util/color';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  
  // Search Bar Styles (Google Maps style)
  searchBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? mvs(50) : mvs(10),
    left: mvs(10),
    right: mvs(10),
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(25),
    paddingHorizontal: mvs(15),
    paddingVertical: mvs(12),
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: mvs(10),
  },
  searchIconText: {
    fontSize: mvs(18),
    color: colors.grey,
  },
  searchInput: {
    flex: 1,
    fontSize: mvs(16),
    color: colors.black,
    paddingVertical: 0,
  },
  voiceButton: {
    marginLeft: mvs(10),
    padding: mvs(5),
  },
  voiceIcon: {
    fontSize: mvs(18),
  },
  profileButton: {
    marginLeft: mvs(10),
  },
  profileImage: {
    width: mvs(30),
    height: mvs(30),
    borderRadius: mvs(15),
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: mvs(16),
  },
  suggestionsContainer: {
    marginTop: mvs(5),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Floating Buttons
  floatingButtons: {
    position: 'absolute',
    right: mvs(15),
    bottom: mvs(120),
    alignItems: 'center',
  },
  layersButton: {
    backgroundColor: colors.white,
    width: mvs(50),
    height: mvs(50),
    borderRadius: mvs(25),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: mvs(10),
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  layersIcon: {
    fontSize: mvs(20),
  },
  currentLocationButton: {
    backgroundColor: colors.white,
    width: mvs(50),
    height: mvs(50),
    borderRadius: mvs(25),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  // Location Info Overlay
  locationInfo: {
    position: 'absolute',
    bottom: mvs(20),
    left: mvs(15),
    right: mvs(15),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    padding: mvs(15),
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dragToSelectText: {
    fontSize: mvs(14),
    color: colors.grey,
    textAlign: 'center',
    marginBottom: mvs(10),
  },
  selectedLocationContainer: {
    marginTop: mvs(5),
  },
  selectedLocationLabel: {
    fontSize: mvs(12),
    color: colors.grey,
    marginBottom: mvs(3),
  },
  selectedLocationText: {
    fontSize: mvs(14),
    color: colors.black,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: mvs(14),
    color: colors.grey,
    marginLeft: mvs(5),
  },

  // Manual Entry Styles
  manualContainer: {
    flex: 1,
  },
  manualContent: {
    padding: mvs(20),
  },
  manualSection: {
    flex: 1,
  },
  manualTitle: {
    fontSize: mvs(20),
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: mvs(10),
  },
  manualDescription: {
    fontSize: mvs(14),
    color: colors.grey,
    marginBottom: mvs(20),
    lineHeight: mvs(20),
  },
  inputContainer: {
    marginBottom: mvs(20),
  },
  inputLabel: {
    fontSize: mvs(16),
    color: colors.black,
    marginBottom: mvs(8),
    fontWeight: '500',
  },
  manualInput: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: mvs(8),
    padding: mvs(12),
    fontSize: mvs(14),
    color: colors.black,
    minHeight: mvs(80),
  },
  currentLocationContainer: {
    backgroundColor: colors.lightGrey || '#f9f9f9',
    padding: mvs(15),
    borderRadius: mvs(8),
    marginTop: mvs(10),
  },
  currentLocationLabel: {
    fontSize: mvs(12),
    color: colors.grey,
    marginBottom: mvs(5),
  },
  currentLocationText: {
    fontSize: mvs(14),
    color: colors.black,
    fontWeight: '500',
  },

  // Footer Styles
  footer: {
    padding: mvs(15),
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    flexDirection: 'row',
    gap: mvs(10),
  },
  toggleViewButton: {
    flex: 1,
    backgroundColor: colors.gray || '#f0f0f0',
    paddingVertical: mvs(15),
    borderRadius: mvs(10),
    alignItems: 'center',
  },
  toggleViewText: {
    color: colors.black,
    fontSize: mvs(14),
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: colors.lightgreen || '#007AFF',
    paddingVertical: mvs(15),
    borderRadius: mvs(10),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
});
  