/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {
  AdvertiseSVG,
  CartSVG,
  HeartSVG,
  HOMESVG,
  NewsSVG,
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

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyTabs = () => {
  const {token} = useSelector(state => state.user); // Token will indicate if the user is logged in
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    console.log('TOKEN: ', token);
  }, [token]); // This will log the token every time it changes.

  const handleLoginSuccess = () => {
    setIsModalVisible(false);
  };

  const handleTabPress = (e, route, navigation) => {
    if (!token) {
      e.preventDefault(); // Prevent navigation if not logged in
      setIsModalVisible(true); // Show the modal if not logged in
    } else {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.green,
          tabBarIcon: ({focused}) => {
            let IconComponent;
            let label;
            const activeColor = colors.green;
            const inactiveColor = colors.grey;

            switch (route.name) {
              case 'Search':
                IconComponent = HOMESVG;
                // label = 'Home';
                break;
              case 'Favourite':
                IconComponent = HeartSVG;
                // label = 'Favourite';
                break;
              case 'Advertise':
                IconComponent = PlusSvg;
                // label = 'Advertise';
                break;
              case 'CartScreen':
                IconComponent = CartSVG;
                // label = 'Cart';
                break;
              case 'Profile':
                IconComponent = ProfileSVG;
                // label = 'Profile';
                break;
              default:
                IconComponent = HOMESVG;
              // label = 'Home';
            }

            return (
              <View style={styles.iconContainer}>
                <IconComponent color={focused ? activeColor : inactiveColor} />
                {/* <Bold
                  style={[
                    styles.label,
                    {color: focused ? activeColor : inactiveColor},
                  ]}>
                  {label}
                </Bold> */}
              </View>
            );
          },
        })}>
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Favourite"
          component={FavouriteScreen}
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
      </Tab.Navigator>

      <AddModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
