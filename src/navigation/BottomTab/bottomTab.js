/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {
  AdvertiseSVG,
  CartSVG,
  ChatSVG,
  HeartSVG,
  HOMESVG,
  NewsSVG,
  NotificationSVG,
  ProfileSVG,
  SearchSVG,
} from '../../assets/svg';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import Profile from '../../screens/App/Profile';
import SearchScreen from '../../screens/App/Search';
import FavouriteScreen from '../../screens/App/Favourite';
import CartScreen from '../../screens/App/Cart';
import AdvertiseScreen from '../../screens/App/Advertise';
import Bold from '../../typography/BoldText';
import AddModal from '../../components/Modals/AddModal';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import PlusSvg from '../../assets/svg/plussvg';
import Chat from '../../screens/App/Chat';
import Notification from '../../screens/App/Notification/index';
import InboxScreen from '../../screens/App/Inbox';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyTabs = () => {
  const {token, role} = useSelector(state => state.user); // Token will indicate if the user is logged in
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log('TOKEN: ', token);
  }, [token]);

  const handleLoginSuccess = () => {
    setIsModalVisible(false);
  };

  const handleTabPress = (e, route, navigation) => {
    if (!token) {
      e.preventDefault();
      setIsModalVisible(true);
    } else {
      navigation.navigate(route.name);
    }
  };

  const getIconComponent = React.useCallback((routeName, focused) => {
    const activeColor = 'rgba(70, 80, 45, 1)';
    const inactiveColor = colors.grey;
    const color = focused ? activeColor : inactiveColor;

    switch (routeName) {
      case 'Home':
        return <HOMESVG color={color} />;
      case 'Favourite':
        return <HeartSVG color={color} />;
      case 'CartScreen':
        return <CartSVG color={color} />;
      case 'Advertise':
        return <PlusSvg color={color} />;
      case 'Inbox':
        return <ChatSVG color={color} />;
      case 'Profile':
        return <ProfileSVG color={color} />;
      case 'Notification':
        return <NotificationSVG color={color} />;
      default:
        return <HOMESVG color={color} />;
    }
  }, []);

  const renderTabs = () => {
    if (role == 2) {
      // Seller: Home, Inbox, Advertise, Profile
      return (
        <>
          <Tab.Screen name="Home" component={SearchScreen} />
          <Tab.Screen
            name="Inbox"
            component={InboxScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Advertise"
            component={AdvertiseScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Notification"
            component={Notification}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
        </>
      );
    } else if (role == 3) {
      // Buyer: Home, Inbox, Favourites, Cart, Profile
      return (
        <>
          <Tab.Screen name="Home" component={SearchScreen} />
          <Tab.Screen
            name="Inbox"
            component={InboxScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Favourite"
            component={FavouriteScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="CartScreen"
            component={CartScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
        </>
      );
    } else {
      return (
        <>
          <Tab.Screen name="Home" component={SearchScreen} />
          <Tab.Screen
            name="Inbox"
            component={Chat}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Favourite"
            component={FavouriteScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="CartScreen"
            component={CartScreen}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            listeners={({navigation, route}) => ({
              tabPress: e => handleTabPress(e, route, navigation),
            })}
          />
        </>
      );
    }
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        key={role}
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#ADBD6E',
          tabBarIcon: ({focused}) => (
            <View style={styles.iconContainer}>
              {getIconComponent(route.name, focused)}
            </View>
          ),
        })}>
        {renderTabs()}
      </Tab.Navigator>

      <AddModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

// return (
//   <View style={{flex: 1}}>
//     <Tab.Navigator
//       screenOptions={({route}) => ({
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: styles.tabBar,
//         tabBarActiveTintColor: colors.green,
//         tabBarIcon: ({focused}) => {
//           let IconComponent;
//           let label;
//           const activeColor = colors.green;
//           const inactiveColor = colors.grey;

//           switch (route.name) {
//             case 'Search':
//               IconComponent = HOMESVG;
//               // label = 'Home';
//               break;
//             case 'Favourite':
//               IconComponent = HeartSVG;
//               // label = 'Favourite';
//               break;
//             case 'Advertise':
//               IconComponent = PlusSvg;
//               // label = 'Advertise';
//               break;
//             case 'CartScreen':
//               IconComponent = CartSVG;
//               // label = 'Cart';
//               break;
//             case 'Profile':
//               IconComponent = ProfileSVG;
//               // label = 'Profile';
//               break;
//             default:
//               IconComponent = HOMESVG;
//             // label = 'Home';
//           }

//           return (
//             <View style={styles.iconContainer}>
//               <IconComponent color={focused ? activeColor : inactiveColor} />
//               {/* <Bold
//                 style={[
//                   styles.label,
//                   {color: focused ? activeColor : inactiveColor},
//                 ]}>
//                 {label}
//               </Bold> */}
//             </View>
//           );
//         },
//       })}>
//       <Tab.Screen name="Search" component={SearchScreen} />
//       <Tab.Screen
//         name="Favourite"
//         component={FavouriteScreen}
//         listeners={({navigation, route}) => ({
//           tabPress: e => handleTabPress(e, route, navigation),
//         })}
//       />
//       <Tab.Screen
//         name="Advertise"
//         component={AdvertiseScreen}
//         listeners={({navigation, route}) => ({
//           tabPress: e => handleTabPress(e, route, navigation),
//         })}
//       />
//       <Tab.Screen
//         name="CartScreen"
//         component={CartScreen}
//         listeners={({navigation, route}) => ({
//           tabPress: e => handleTabPress(e, route, navigation),
//         })}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         listeners={({navigation, route}) => ({
//           tabPress: e => handleTabPress(e, route, navigation),
//         })}
//       />
//     </Tab.Navigator>

//     <AddModal
//       visible={isModalVisible}
//       onClose={() => setIsModalVisible(false)}
//     />
//   </View>
// );
// };

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    height: mvs(65),
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
    width: mvs(60),
    marginTop: mvs(3),
    fontFamily: 'DMSans-regular',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
});

export default MyTabs;
