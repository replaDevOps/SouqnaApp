import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  // modalOverlay:lovigoy
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  modalContainer: {
    width: '95%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },

  modalButton: {
    backgroundColor: colors.lightgreen,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },

  buttonContainer: {
    marginTop: mvs(30),
  },
  HeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(10),
  },
  passwordContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: mvs(15),
    top: mvs(15),
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(30),
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 45,
    color: colors.lightgreen,
  },
  text: {
    marginVertical: mvs(10),
  },
  button: {
    backgroundColor: colors.primary,
    padding: mvs(15),
    borderRadius: mvs(8),
    alignItems: 'center',
    marginTop: mvs(10),
  },
  buttonText: {
    color: colors.white,
    fontSize: mvs(16),
  },
  input: {
    marginRight: mvs(10),
    paddingLeft: mvs(10),
    borderWidth: mvs(1),
    borderColor: colors.gray1,
    borderRadius: mvs(5),
    height: mvs(50),
    width: '100%',
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: mvs(12),
    marginTop: mvs(5),
  },
  eyeIcon: {
    position: 'absolute',
    right: mvs(10),
    top: mvs(12),
    zIndex: 1,
  },
  registerText: {
    color: colors.black,
    marginTop: mvs(10),
    textAlign: 'center',
    // paddingRight: mvs(10),
  },
  registerLink: {
    fontWeight: 'bold',
    color: colors.lightgreen,
    marginBottom: mvs(20),
    fontFamily: 'Amiri-Regular',
  },
  ForgetPassword: {
    textAlign: 'right',
    fontWeight: 'bold',
    color: colors.lightgreen,
    marginRight: mvs(20),
    fontFamily: 'Amiri-Regular',
    textDecorationLine: 'underline',
  },
});

export default styles;
