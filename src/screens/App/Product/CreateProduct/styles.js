import {StyleSheet} from 'react-native';
import {colors} from '../../../../util/color';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.green,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  imageWrapper: {
    width: '48%', // Two items per row (100% / 2) minus some margin
    aspectRatio: 1, // Makes it square (width and height same ratio)
    margin: '1%',
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
    right: 2,
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
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#323232',
    marginBottom: 20,

    // position: 'absolute',
    alignSelf: 'center',
    width: '80%', // Optional: to make it a bit wide but still centered
    borderRadius: 8, // Optional: rounded edges
  },
});
