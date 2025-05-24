import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  providerContainer: {
    padding: mvs(10),
    backgroundColor: colors.white,
    marginTop: mvs(10),
  },

  providerTitle: {
    fontSize: mvs(16),
  },
  providerName: {
    marginVertical: mvs(10),
    fontSize: mvs(14),
    color: '#000',
  },
  display: {
    color: colors.black,
  },
  attributes: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: mvs(10),
  },
  attributeBox: {
    backgroundColor: colors.lightgreen,
    borderRadius: mvs(15),
    paddingVertical: mvs(2),
    paddingHorizontal: mvs(15),
    marginRight: mvs(10),
    marginVertical: mvs(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  attributeBox1: {
    backgroundColor: '#E0BBE4',
    borderRadius: mvs(15),
    paddingVertical: mvs(2),
    paddingHorizontal: mvs(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: mvs(216),
    flexWrap: 'wrap',
  },
  attributeText: {
    fontSize: mvs(14),
    marginLeft: mvs(10),
  },
  leftText: {
    fontSize: mvs(14),
    // marginLeft: mvs(10),
    color: colors.black,
  },
});
export default styles;
