import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container:{
   backgroundColor:'#fff',
   flex:1,
  },
  header: {
    fontSize: mvs(25),
    fontWeight:'bold',
    marginLeft: mvs(7),
  },
  headerContainer: {
    padding: mvs(10),
    backgroundColor: colors.white,
    marginVertical: mvs(20),
  },
  content: {
    // padding: mvs(10),
    backgroundColor: colors.white,
   paddingHorizontal:mvs(10),
    // marginVertical: mvs(10),
  },
  // subCategoryItem: {
  //   padding: mvs(10),
  //   borderBottomWidth: 1,
  //   borderBottomColor: colors.grey,
  // },
  subCategoryItem: {
    paddingBottom: 10,
    // marginVertical: 6,
    // backgroundColor: '#f2f2f2',
    alignItems:'center',
    flexDirection:'row',
    borderRadius: 8,
    borderBottomWidth:1,
    borderBottomColor:colors.grey,
    justifyContent:'space-between'   
  },
  subCategoryText: {
    fontSize: mvs(18),
    paddingLeft:mvs(10)

  },
  titleContainer:{
    flexDirection:'row',alignItems:'center',
        paddingLeft:mvs(10)
  }
});
export default styles;
