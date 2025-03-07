import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: mvs(20),
  },
  inputContainer: {
    marginBottom: mvs(20),
  },
  input: {
    height: mvs(50),
    borderColor: colors.green,
    borderWidth: mvs(1),
    marginBottom: mvs(15),
    paddingLeft: mvs(10),
    borderRadius: mvs(5),
  },
});
export default styles;
