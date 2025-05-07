import { StyleSheet } from "react-native";
import { mvs } from '../../../util/metrices';
import { colors } from '../../../util/color';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: mvs(10),
        paddingTop: mvs(50),
        paddingBottom: mvs(10),
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
        backgroundColor: colors.white,
        borderRadius: mvs(4),
        paddingHorizontal: mvs(10),
        paddingVertical: mvs(4),
        marginHorizontal: mvs(4),
    },
    searchBar: {
        flex: 1,
        height: 40,
        fontSize: 16,
        marginLeft: 10,
        color: colors.black,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    locationIcon: {
        backgroundColor: colors.green,
        borderRadius: 50,
        padding: 6,
    },
    notificationIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.gray,
        width: 24,
        height: 24,
        borderRadius: 14,
    },
    header: {
        paddingVertical: mvs(12),
        fontSize: mvs(28),
        fontWeight: 'bold',
    },
    messagesWrapper: {
        marginHorizontal: mvs(14),
    },
    AllmessageContainer: {},
    messageContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
        backgroundColor: colors.white,
        borderRadius: mvs(5),
        paddingHorizontal: mvs(10),
        paddingVertical: mvs(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    messageHeader: {
        flexDirection: 'row',
    },
    messageHeaderInfo: {
        paddingLeft: mvs(9),
        justifyContent: 'center',
        gap: 5,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    senderName: {
        fontWeight: 'bold',
        fontSize: mvs(16),
    },
    messageText: {
        color: colors.grey,
        fontSize: mvs(13),
    },
    messageBody: {
        alignItems: 'center',
        gap: mvs(4),
    },
    messageTime: {
        fontSize: mvs(12),
    },
    unreadBadge: {
        backgroundColor: '#adbd6e',
        padding: mvs(3),
        borderRadius: mvs(22),
        width: mvs(25),
        height: mvs(25),
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadBadgeText: {
        color: colors.white,
        fontSize: mvs(16),
        fontWeight: 'bold',
    },
});

export default styles;
