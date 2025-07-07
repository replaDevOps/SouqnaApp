import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // padding: mvs(20),
  },
  formContainer: {
    flex: 1,
    // justifyContent: 'center',
    // padding: mvs(20),
    paddingHorizontal: mvs(10),
  },
  title: {
    fontSize: mvs(24),
    fontWeight: 'bold',
    color: colors.green, // Dark blue color as shown in the image
    marginBottom: mvs(30),
    textAlign: 'center',
  },
  label: {
    fontSize: mvs(14),
    color: colors.green, // Dark blue color to match title
    marginBottom: mvs(8),
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: mvs(16),
    color: colors.black,
    // backgroundColor:'#000'
  },
  inputWrapper: {
    height: mvs(50),
    // flex:1,
    position: 'relative',
    width: '100%',
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#fff', // Light gray background for inputs
    borderRadius: mvs(5),
    marginBottom: mvs(20),
    paddingHorizontal: mvs(15),
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 3,
  },
  resetButton: {
    height: mvs(50),
    backgroundColor: '#008e91', // Green color as shown in the image
    borderRadius: mvs(25), // Rounded button
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: mvs(10),
    // Shadow for iOS
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // // Elevation for Android
    // elevation: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: mvs(16),
    fontWeight: '600',
  },
  logo: {
    width: mvs(200),
    height: mvs(200),
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center', // Changed from 'flex-end' to 'center'
    // marginBottom: mvs(20),
    // marginVertical: mvs(0), // Added some margin at the bottom for spacing
  },
  eyeButton: {
    // backgroundColor:'#000'
  },
});

export default styles;
