import {StyleSheet, Dimensions} from 'react-native'; 
import {mvs} from '../../../util/metrices'; 
import {colors} from '../../../util/color';  

// Get device height for centering
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({   
  container: {     
    flex: 1,     
    backgroundColor: colors.white,     
    flexDirection: 'row',     
    // justifyContent: 'center',     
    // alignItems: 'center',     
    // paddingHorizontal: mvs(10),     
    // paddingBottom: mvs(8),   
  },   
  searchBarContainer: {     
    flexDirection: 'row',     
    alignItems: 'center',     
    flex: 1,     
    shadowColor: '#000',     
    shadowOffset: {width: 0, height: 2},     
    shadowOpacity: 0.3, // Adjusted opacity for a subtler shadow effect     
    shadowRadius: 4,     
    elevation: 4, // Adjusted for better cross-platform appearance     
    zIndex: 10,     
    backgroundColor: colors.white,     
    borderRadius: mvs(6), // Slightly more rounded corners     
    paddingHorizontal: mvs(12), // More padding for better touch experience     
    paddingVertical: mvs(6), // Adjusted padding for a more balanced look     
    marginHorizontal: mvs(8), // Consistent margin across elements     
    marginTop: mvs(10),   
  },   
  searchBar: {     
    flex: 1,     
    height: mvs(45), // Adjusted height for better usability     
    fontSize: mvs(16), // Adjusted font size for better readability     
    marginLeft: mvs(10),     
    color: colors.black,   
  },   
  icon: {     
    justifyContent: 'center',     
    alignItems: 'center',   
  },   
  notificationIcon: {     
    justifyContent: 'center',     
    alignItems: 'center',     
    backgroundColor: colors.gray,     
    width: mvs(28), // Slightly larger to improve touch targets     
    height: mvs(28),     
    borderRadius: mvs(14),   
  },   
  header: {     
    paddingVertical: mvs(16),     
    paddingLeft: mvs(10),     
    fontSize: mvs(22),     
    fontWeight: '600', // Lighter font weight for smaller screens   
  },    
  newMessageContainer: {   
    // shadowColor: '#000',   
    // shadowOffset: { width: 0, height: 2 },   
    // shadowOpacity: 0.5,   
    // shadowRadius: 4,   
    // elevation: 3,   
    borderWidth:1,
    borderColor:'#eee',
    backgroundColor: colors.white,   
    flexDirection: 'row',   
    paddingHorizontal: mvs(8),   
    paddingVertical: mvs(8),   
    borderRadius: mvs(8), 
  },  
  messageContentWrapper: {   
    gap: mvs(5),   
    padding: mvs(5),   
    flex: 1, 
  },  
  messageTopRow: {   
    flexDirection: 'row',   
    justifyContent: 'space-between',   
    alignItems: 'center', 
  },  
  messagePreviewContainer: {   
    width: '75%', 
  },    
  messagesWrapper: {     
    // marginHorizontal: mvs(14),     
    marginBottom: 20,   
  },   
  messageContainer: {     
    shadowColor: '#000',     
    shadowOffset: {width: 0, height: 2},     
    shadowOpacity: 0.5,     
    shadowRadius: 4,     
    elevation: 3,     
    backgroundColor: colors.white,     
    borderRadius: mvs(8),     
    paddingHorizontal: mvs(12),     
    paddingVertical: mvs(12),     
    flexDirection: 'row',     
    justifyContent: 'space-between',   
  },   
  messageHeader: {     
    flexDirection: 'row',   
  },   
  messageHeaderInfo: {     
    paddingLeft: mvs(12),     
    justifyContent: 'center',     
    gap: 5,   
  },   
  profileImage: {     
    width: mvs(50),     
    height: mvs(50),     
    borderRadius: mvs(25),   
  },   
  senderName: {     
    fontWeight: 'bold',     
    fontSize: mvs(17),   
  },   
  messageText: {     
    color: colors.grey,     
    fontSize: mvs(14),   
  },   
  messageBody: {     
    alignItems: 'center',   
  },   
  messageTime: {     
    fontSize: mvs(14),   
  },   
  unreadBadge: {     
    backgroundColor: colors.lightgreen,     
    // paddingVertical: mvs(3), // Adjusted padding for better centering     
    // paddingHorizontal: mvs(8), // Adjusted to fit content dynamically     
    borderRadius: mvs(15),     
    minWidth: mvs(20),     
    height: mvs(20),     
    justifyContent: 'center',     
    alignItems: 'center',   
  },   
  unreadBadgeText: {     
    color: colors.white,     
    fontSize: mvs(12),     
    fontWeight: 'bold',   
  },   
  emptyInbox: {     
    height: height - 200, // Adjust this value based on header height     
    backgroundColor: '#fbfbfb', // Match your app's background color     
    alignItems: 'center',     
    justifyContent: 'center',
    paddingHorizontal: mvs(20),
  },   
  emptyInboxText: {     
    textAlign: 'center',     
    fontSize: 25,     
    fontWeight: 'bold',
    marginTop: mvs(20),
    color: '#333' // Better text color for readability
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: mvs(20),
    marginTop: mvs(40),
  },
  emptyText: {
    fontSize: mvs(16),
    color: colors.grey,
    textAlign: 'center',
    marginBottom: mvs(20),
  },
  startChatButton: {
    backgroundColor: colors.lightgreen,
    paddingVertical: mvs(10),
    paddingHorizontal: mvs(20),
    borderRadius: mvs(25),
    marginTop: mvs(20),
  },
  startChatButtonText: {
    color: colors.white,
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
});  

export default styles;