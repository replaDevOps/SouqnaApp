import {StyleSheet} from 'react-native';
import {colors} from '../../../../util/color';
import {mvs} from '../../../../util/metrices';

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
  // Added section container for consistent spacing
  sectionContainer: {
    marginBottom: mvs(20),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: mvs(15),
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: mvs(18),
    marginBottom: mvs(10),
  },
  // Category styles
  categoryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: mvs(8),
  },
  categoryImage: {
    width: mvs(60),
    height: mvs(60),
    borderRadius: mvs(30),
  },
  categoryTitle: {
    fontSize: mvs(18),
    fontWeight: 'bold',
  },
  categorySubtitle: {
    fontSize: mvs(14),
    paddingTop: mvs(4),
  },
  changeText: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.blue,
  },
  // Condition button styles
  conditionButton: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: mvs(5),
    marginRight: mvs(10),
    padding: mvs(10),
  },
  selectedCondition: {
    backgroundColor: colors.lightgreen,
    borderColor: colors.black,
  },
  conditionText: {
    fontSize: mvs(18),
    fontWeight: '300',
    color: '#333',
  },
  // Location styles - fixed
  locationContainer: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    borderColor: '#cccccc',
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    marginLeft: mvs(10),
    fontSize: mvs(16),
    padding: mvs(5),
  },
  input: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: '#cccccc',
    padding: 13,
    borderRadius: 5,
    fontSize: mvs(16),
    color: '#333',
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
    color: colors.black,
    fontWeight: 'bold',
    fontSize: mvs(16),
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: mvs(15),
  },
  imageWrapper: {
    marginHorizontal: mvs(10), // space between images

    width: mvs(120),
    height: mvs(120),
    // aspectRatio: 1,
    marginHorizontal: mvs(6),
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
    alignSelf: 'center',
    width: '80%',
    borderRadius: 8,
  },
  flatListContainer: {
    // alignItems: 'center',
    marginHorizontal:20,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: mvs(5),
    // paddingHorizontal: 20,
    paddingVertical: mvs(30),
    alignItems: 'center',
    marginTop: mvs(15),
  },
  iconRow: {
    paddingHorizontal:mvs(30),
    paddingVertical:mvs(38),
    height:mvs(122),
    borderWidth:1,
    borderRadius:mvs(7),
    borderColor:colors.grey,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  flatListContainer: {
    paddingLeft: mvs(20),
    paddingRight: mvs(15),
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
    fontWeight: 'bold',
    color: '#003f4f',
  },
  noteText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});
