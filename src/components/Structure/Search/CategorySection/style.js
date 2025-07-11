import {StyleSheet} from 'react-native';
import {mvs} from '../../../../util/metrices';
import {colors} from '../../../../util/color';

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: mvs(10),
    marginHorizontal: mvs(5),
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: mvs(75),
  },
  IconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: mvs(55),
    height: mvs(55),
    borderRadius: mvs(27),
    backgroundColor: colors.lightorange,
  },
  textContainer: {
    width: mvs(65),
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  // categoryText: {
  //   marginTop: mvs(8),
  //   fontSize: mvs(13),
  //   fontWeight: '400',
  //   color: colors.black,
  //   textAlign: 'center',
  //   flexWrap: 'wrap',
  //   width: '100%',
  // },



// Update styles
row1: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: mvs(20),
  paddingHorizontal: mvs(10),
},

row: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: mvs(15),
  paddingHorizontal: mvs(10),
},

bigCard: {
  width: '48%',
  height: mvs(100),
  backgroundColor: '#fff',
  borderRadius: mvs(12),
  padding: mvs(10),
  justifyContent: 'space-between',
  position: 'relative',
  borderWidth: 1,
  borderColor: '#ddd',
  // elevation: 4,
  // shadowColor: '#000',
  // shadowOffset: { width: 0, height: 2 },
  // shadowOpacity: 0.1,
  // shadowRadius: 4,
},

smallCard: {
  width: '30%',
  height: mvs(100),
  backgroundColor: '#fff',
  borderRadius: mvs(12),
  padding: mvs(10),
  justifyContent: 'space-between',
  position: 'relative',
  borderWidth: 1,
  borderColor: '#ddd',
  // elevation: 4,
  // shadowColor: '#000',
  // shadowOffset: { width: 0, height: 2 },
  // shadowOpacity: 0.1,
  // shadowRadius: 4,
},

bigIcon: {
  width: mvs(60),
  height: mvs(60),
  resizeMode: 'stretch',
},

smallIcon: {
  width: mvs(60),
  height: mvs(50),
  borderRadius: mvs(25),
  resizeMode: 'stretch',
},
BigcategoryText: {
  fontSize: mvs(20),
  fontWeight: 'bold',
  color: '#333',
  // textAlign: 'center',
  marginTop: mvs(4),
},
categoryText: {
  fontSize: mvs(15),
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
  marginVertical: mvs(4),
},

textTop: {
  // alignItems: 'center',
  marginBottom: mvs(10),
},

iconBottomRight: {
  position: 'absolute',
  bottom: mvs(10),
  right: mvs(10),
},

iconBottomFull: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: 1,
},
bigCardContent: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  gap: mvs(6),
},


});

export default styles;
