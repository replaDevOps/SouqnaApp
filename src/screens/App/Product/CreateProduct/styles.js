import {StyleSheet, I18nManager} from 'react-native';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';

// Detect RTL layout
const isRTL = I18nManager.isRTL;

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
    marginBottom: 20,
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  // Added section container for consistent spacing
  sectionContainer: {
    marginBottom: mvs(20),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: mvs(15),
  },
  sectionTitle: {
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
    fontSize: mvs(18),
    marginBottom: mvs(10),
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  // Category styles with RTL support
  categoryBox: {
    flexDirection: isRTL ? 'row-reverse' : 'row', // RTL support
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: mvs(8),
  },
  categoryImage: {
    width: mvs(60),
    height: mvs(60),
    borderRadius: mvs(30),
  },
  fixedTextBox: {
    width: '70%',
    height: mvs(50),
    justifyContent: 'center',
    marginLeft: isRTL ? mvs(10) : mvs(10), // Adjust for RTL
    marginRight: isRTL ? mvs(10) : mvs(10), // Adjust for RTL
  },

  categoryTitle: {
    fontSize: mvs(16),
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },

  categorySubtitle: {
    fontSize: mvs(14),
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },

  changeText: {
    fontSize: mvs(14),
    color: colors.blue,
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
    bottom: 10,
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },

  // Condition button styles
  conditionButton: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: mvs(5),
    marginRight: isRTL ? 0 : mvs(10), // RTL support
    marginLeft: isRTL ? mvs(10) : 0, // RTL support
    padding: mvs(10),
  },
  selectedCondition: {
    backgroundColor: colors.lightgreen,
    borderColor: colors.black,
  },
  conditionText: {
    fontSize: mvs(18),
    // fontWeight: '300',
    color: '#333',
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  // Location styles with RTL support
  locationContainer: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: isRTL ? 'row-reverse' : 'row', // RTL support
    borderColor: '#cccccc',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    marginLeft: isRTL ? 0 : mvs(10), // RTL support
    marginRight: isRTL ? mvs(10) : 0, // RTL support
    fontSize: mvs(16),
    padding: mvs(5),
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  input: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: '#cccccc',
    padding: 13,
    borderRadius: 5,
    fontFamily: 'Amiri-Regular',
    fontSize: mvs(16),
    color: '#333',
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },

  // Price input specific styles with RTL support
  priceContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    backgroundColor: colors.white,
    minHeight: mvs(50),
    overflow: 'hidden',
  },

  priceInput: {
    flex: 1,
    fontSize: mvs(16),
    color: '#333',
    textAlign: isRTL ? 'right' : 'left',
    paddingHorizontal: mvs(13),
    paddingVertical: mvs(13),
  },

  currencyDropdownContainer: {
    width: mvs(80),
    backgroundColor: '#f0f0f0',
    borderLeftWidth: isRTL ? 0 : 1,
    borderRightWidth: isRTL ? 1 : 0,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: mvs(48),
  },

  submitButton: {
    backgroundColor: colors.blue,
    padding: 15,
    marginTop: mvs(30),
    marginBottom: mvs(30),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: colors.white,
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
    fontSize: mvs(16),
    textAlign: 'center',
  },
  imagePreviewContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row', // RTL support
    flexWrap: 'wrap',
    marginTop: mvs(15),
  },
  imageWrapper: {
    marginHorizontal: mvs(6),
    width: mvs(120),
    height: mvs(120),
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeIcon: {
    position: 'absolute',
    top: 2,
    right: isRTL ? undefined : 2, // RTL support
    left: isRTL ? 2 : undefined, // RTL support
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
  },
  snackbar: {
    backgroundColor: '#323232',
    marginBottom: 20,
    alignSelf: 'center',
    width: '80%',
    borderRadius: 8,
  },
  flatListContainer: {
    marginHorizontal: 20,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: mvs(5),
    paddingVertical: mvs(30),
    alignItems: 'center',
    marginTop: mvs(15),
  },
  iconRow: {
    paddingHorizontal: mvs(30),
    paddingVertical: mvs(38),
    height: mvs(122),
    borderWidth: 1,
    borderRadius: mvs(7),
    borderColor: colors.grey,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIcon: {
    marginHorizontal: 10,
    color: '#9bb1d3',
  },
  activeIcon: {
    borderWidth: 2,
    borderColor: '#4a75f0',
    borderRadius: 8,
    padding: 5,
    backgroundColor: '#dbe8fd',
    color: '#4a75f0',
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#003f4f',
    borderRadius: 6,
    marginBottom: 12,
  },
  addButtonText: {
    // fontWeight: 'bold',
    fontFamily: 'Amiri-Bold',
    color: '#003f4f',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  radioContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row', // RTL support
    alignItems: 'center',
    marginTop: mvs(10),
  },
  radioOption: {
    flexDirection: isRTL ? 'row-reverse' : 'row', // RTL support
    alignItems: 'center',
    marginRight: isRTL ? 0 : mvs(30), // RTL support
    marginLeft: isRTL ? mvs(30) : 0, // RTL support
  },
  radioWrapper: {
    height: mvs(20),
    width: mvs(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuter: {
    height: mvs(20),
    width: mvs(20),
    borderRadius: mvs(10),
    borderWidth: 2,
    borderColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.lightgreen,
  },
  radioInner: {
    height: mvs(10),
    width: mvs(10),
    borderRadius: mvs(5),
    backgroundColor: colors.green,
  },
  radioText: {
    marginLeft: isRTL ? 0 : mvs(5), // RTL support
    marginRight: isRTL ? mvs(5) : 0, // RTL support
    fontSize: mvs(15),
    color: colors.black,
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  fieldContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  fieldLabel: {
    fontSize: 16,
    marginRight: isRTL ? 0 : 10, // RTL support
    marginLeft: isRTL ? 10 : 0, // RTL support
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  fieldInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },
  selectText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: isRTL ? 0 : 10, // RTL support
    marginLeft: isRTL ? 10 : 0, // RTL support
    textAlign: isRTL ? 'right' : 'left', // RTL support
  },

  // Additional RTL utility styles
  rtlRow: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
  },
  rtlText: {
    textAlign: isRTL ? 'right' : 'left',
  },
  rtlMarginLeft: {
    marginLeft: isRTL ? 0 : mvs(8),
    marginRight: isRTL ? mvs(8) : 0,
  },
  rtlMarginRight: {
    marginLeft: isRTL ? mvs(8) : 0,
    marginRight: isRTL ? 0 : mvs(8),
  },
});
