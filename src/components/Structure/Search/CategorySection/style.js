import {StyleSheet} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: mvs(10),
    paddingTop: mvs(10),
    flexDirection: 'row',
    backgroundColor: colors.white,
    justifyContent: 'space-evenly',
  },
  categoryItem: {
    alignItems: 'center',
    left: mvs(30),
    justifyContent: 'center',
    width: mvs(70),
    marginBottom: mvs(10),
  },
  IconContainer: {
    padding: 10,
    borderRadius: mvs(8),
    backgroundColor: colors.lightgreen,
  },
  textContainer: {
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  categoryText: {
    marginTop: mvs(8),
    fontSize: mvs(10),
    color: colors.black,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
});

export default styles;
