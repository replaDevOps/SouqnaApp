import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';

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
    gap: 5, // If using RN 0.71+, otherwise use marginRight
  },

  uploadIcon: {
    marginRight: 5,
  },
  uploadLabel: {
    textAlign: 'center',
    color: '#888',
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
});
export default styles;
