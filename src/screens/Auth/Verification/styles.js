import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  svgBackground: {
    backgroundColor: '#f0f0f0', // Light grey background for the circle
    borderRadius: 50, // Circle shape
    padding: 20, // Size of the circle
    marginBottom: 10, // Space between the circle and text
    alignItems: 'center', // Centering the SVG inside the circle
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.green,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 10,
  },
  modalCloseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black, // or any color that fits your design
  },
  modalButtonContainer: {
    // alignItems: 'center',
    width: '100%',
  },

  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: 'bold',
    color: colors.green,
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    justifyContent: 'center',
    // alignItems:'center'
  },
  errorContainer: {
    backgroundColor: 'red',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: mvs(8),
    fontSize: mvs(16),
    paddingLeft: mvs(3),
  },
  imagePickerContainer: {
    marginVertical: 10,
    flexDirection: 'row', // Align items horizontally (side by side)
    justifyContent: 'space-between', // Ensure space between the boxes
    alignItems: 'center',
  },
  // uploadBox: {
  //   flex: 0.48, // Allow the boxes to take up equal space
  //   margin: 10,
  //   padding: 10,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 10,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  selfieContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  uploadBox: {
    width: '48%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    position: 'relative',
  },

  imagePickerTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Ensure padding around the text
    paddingHorizontal: 10,
    maxWidth: '80%', // Prevent stretching across the whole width
  },

  uploadLabel: {
    fontSize: 14, // Adjust font size if necessary
    color: '#888',
    textAlign: 'center', // Center align the text
    flexShrink: 1, // Ensure text doesn't overflow or stretch
  },

  uploadIcon: {
    marginRight: 5,
  },

  imagePreview: {
    width: '100%',
    height: '100%',
  },

  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },

  removeIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Container for each image preview
  previewContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  // Remove button style
  removeButton: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    padding: 5,
  },
  removeText: {
    color: 'white',
    fontSize: 12,
  },
  dateInput: {
    height: 50,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  dateText: {
    color: '#000',
  },
  datePlaceholder: {
    color: '#999',
  },
  calendarIcon: {
    padding: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: mvs(0),
    backgroundColor: colors.white,
    borderRadius: mvs(5),
    height: mvs(50),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray,
  },
  radioOption: {
    marginHorizontal: mvs(5),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: mvs(20),
    width: mvs(20),
    borderRadius: mvs(10),
    borderWidth: 2,
    borderColor: colors.primary || '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: mvs(10),
    width: mvs(10),
    borderRadius: mvs(5),
    backgroundColor: colors.primary || '#007bff',
  },
  radioLabel: {
    fontSize: mvs(16),
    marginLeft: mvs(8),
    color: colors.black,
  },
});
export default styles;
