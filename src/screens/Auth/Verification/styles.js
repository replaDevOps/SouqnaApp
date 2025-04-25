import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
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
  uploadButton: {
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewContainer: {
    position: 'relative',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  removeButton: {
    position: 'relative',
    top: 5,
    right: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 15,
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  label: {
    fontWeight: 'bold',
  },
  uploadText: {
    color: '#333',
  },
  imagePickerContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
});
export default styles;
