import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container:{
   backgroundColor:'#fff',
   flex:1,
  },
  header: {
    fontSize: mvs(16),
    fontWeight:'bold',
    color:colors.grey,
    marginLeft: mvs(7),
  },
  headerContainer: {
    padding: mvs(10),
    backgroundColor: '#fbfbfb',
    marginVertical: mvs(20),
  },
  content: {
    // padding: mvs(10),
    backgroundColor: colors.white,
   paddingHorizontal:mvs(4),
    // marginVertical: mvs(10),
  },
  // subCategoryItem: {
  //   padding: mvs(10),
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.grey,
  // },
  subCategoryItem: {
   marginBottom: 10,
   paddingVertical:8,
    // marginVertical: 6,
    // backgroundColor: '#f2f2f2',
    alignItems:'center',
    flexDirection:'row',
    borderRadius: 8,
    borderBottomWidth:1,
    borderBottomColor:'#f0f0f0',
    justifyContent:'space-between'   
  },
  subCategoryText: {
    fontSize: mvs(18),
    paddingLeft:mvs(4)

  },
  titleContainer:{
    flexDirection:'row',alignItems:'center',
        paddingLeft:mvs(10)
  }
});
export default styles;
