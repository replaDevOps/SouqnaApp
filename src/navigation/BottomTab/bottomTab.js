/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {
  CartSVG,
  ChatSVG,
  HeartSVG,
  HOMESVG,
  NotificationSVG,
  ProfileSVG,
} from '../../assets/svg';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import Profile from '../../screens/App/Profile';
import SearchScreen from '../../screens/App/Search';
import FavouriteScreen from '../../screens/App/Favourite';
import AdvertiseScreen from '../../screens/App/Advertise';
import PlusSvg from '../../assets/svg/plussvg';
import Chat from '../../screens/App/Chat';
import Notification from '../../screens/App/Notification/index';
import InboxScreen from '../../screens/App/Inbox';
import {fetchNotifications} from '../../api/apiServices';
import {setRole} from '../../redux/slices/userSlice';
import AddModal from '../../components/Modals/AddModal';
import VerificationModal from '../../components/Modals/VerificationModal';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const {token, role, actualRole, verificationStatus} = useSelector(
    state => state.user,
  );
  const activeRole = role ?? 3;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const {tokens} = useSelector(state => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // useEffect(() => {
  //   setIsSeller(activeRole === '2' || activeRole === 2);
  // }, [activeRole]);

  const dispatch = useDispatch();
  // Track if we're in seller mode (needed for role 4 users)
  // const [isSeller, setIsSeller] = useState(
  //   activeRole === '2' || activeRole === 2,
  // );
  console.log('{Tokens}', tokens);

  useEffect(() => {
    console.log('TOKEN: ', token);
  }, [token]);
  useEffect(() => {
    if (role == null) {
      dispatch(setRole(3));
    }
  }, [dispatch, role]);

  const handleLoginSuccess = () => {
    setIsModalVisible(false);
  };
  console.log('{Actual Role }', actualRole);
  console.log('{Active Role }', activeRole);

  useEffect(() => {
    const getNotifications = async () => {
      setLoading(true);
      const res = await fetchNotifications(token, activeRole);
      if (res?.status === true && Array.isArray(res?.data)) {
        setNotifications(res.data);
      } else {
        console.warn('No notifications found or error occurred');
      }
      setLoading(false);
    };

    getNotifications();
  }, [token, activeRole]);

  const handleTabPress = (e, route, navigation) => {
    if (route.name === 'Favourite') {
      return navigation.navigate(route.name);
    }

    if (!token) {
      setIsModalVisible(true);
      e.preventDefault();
    } // Show modal if verificationStatus is 0 or 1 AND user clicks Advertise tab
    else if (
      route.name === 'Advertise' &&
      (verificationStatus === 0 || verificationStatus === 1)
    ) {
      e.preventDefault();
      setVerificationModalVisible(true);
      return;
    } else {
      navigation.navigate(route.name);
    }
  };

  // useEffect(() => {
  //   if (activeRole === 4) {
  //     dispatch(setRole(2));
  //   }
  // }, [activeRole]);

  const handleVerifyProfile = () => {
    setVerificationModalVisible(false);
    navigation.navigate('Verification');
  };

  const handleSkipVerification = () => {
    setVerificationModalVisible(false);
  };

  const getIconComponent = React.useCallback((routeName, focused) => {
    // const activeColor = 'rgba(70, 80, 45, 1)';
    const activeColor = colors.green;
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
    if (activeRole == 2 && token) {
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
    } else if (activeRole == 3) {
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
    }
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        key={activeRole}
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#008e91',
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
      <VerificationModal
        visible={verificationModalVisible}
        onVerify={handleVerifyProfile}
        onSkip={handleSkipVerification}
        onClose={() => setVerificationModalVisible(false)}
      />
    </View>
  );
};

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
