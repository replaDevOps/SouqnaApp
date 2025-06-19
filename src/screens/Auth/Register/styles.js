import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: mvs(30),
  },
  HeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(30),
  },
  passwordContainer: {
    position: 'relative',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(20),
    marginBottom: mvs(20),
  },
  switchText: {
    flex: 1,
    marginLeft: mvs(10),
    fontSize: mvs(14),
    color: colors.darkGray,
  },
  iconContainer: {
    position: 'absolute',
    right: mvs(15),
    top: mvs(15),
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: mvs(20),
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 50,
    color: colors.green,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: mvs(10),
    // marginBottom: mvs(10),
    gap: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: mvs(1),
    borderRadius: mvs(8),
    paddingVertical: mvs(4),
    paddingHorizontal: mvs(20),
  },
  selectedRadioButton: {
    borderColor: colors.green,
  },

  radioButtonLabel: {
    fontSize: mvs(16),
    color: colors.black,
    marginLeft: mvs(10),
  },
  radioCircle: {
    width: mvs(16),
    height: mvs(16),
    borderRadius: mvs(10),
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: colors.lightgreen,
  },
  radioDot: {
    width: mvs(5),
    height: mvs(5),
    borderRadius: mvs(4),
    backgroundColor: colors.black,
  },
  howText: {
    fontSize: mvs(14),
  },
  whenText: {
    color: colors.green,
    marginBottom: mvs(10),
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
  termsText: {
    color: colors.grey,
    fontSize: mvs(14),
    marginTop: mvs(20),
    textAlign: 'left',
  },
  termsLink: {
    fontSize: mvs(14),
    color: colors.green,
    textDecorationLine: 'underline',
    lineHeight: mvs(14),
    paddingTop: 0,
  },
});

export default styles;
