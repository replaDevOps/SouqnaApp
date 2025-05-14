/* eslint-disable react-native/no-inline-styles */
// Navigation.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../screens/Auth/Login';
import Register from '../../screens/Auth/Register';
import SplashScreen from '../../screens/Auth/Splash';
import {View} from 'react-native';
import MyTabs from '../BottomTab/bottomTab';
import DataScreen from '../../screens/Modal/Data';
import DesignScreen from '../../screens/Modal/Design';
import AboutScreen from '../../screens/Modal/About';
import HelpScreen from '../../screens/Modal/HelpandFeedback';
import SearchResultsScreen from '../../screens/App/SearchResult';
import ProductDetail from '../../screens/App/ProductDetail';
import AllCategories from '../../screens/App/SearchAllCategories';
import SubCategoryScreen from '../../screens/App/SubCategory';
import ChangePassword from '../../screens/App/ChangePassword';
import AdvertiseAll from '../../screens/App/AdvertiseAll';
import VerificationPage from '../../screens/Auth/Verification';
import CreateProduct from '../../screens/App/Product/CreateProduct';
import MyAccount from '../../screens/App/Sub-Profile/MyAccount';
import SubCategoryMain from '../../screens/App/SubCategoryMain';
import Products from '../../screens/App/Products';
import Chat from '../../screens/App/Chat';
import InboxScreen from '../../screens/App/Inbox';
import CheckoutScreen from '../../screens/Checkout';
import BuyerNotification from '../../screens/App/BuyerNotification';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={MyTabs} />

        <Stack.Screen name="Data" component={DataScreen} />
        <Stack.Screen name="Design" component={DesignScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen
          name="SearchResultsScreen"
          component={SearchResultsScreen}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="AllCategories" component={AllCategories} />
        <Stack.Screen name="SubCategoryScreen" component={SubCategoryScreen} />
        <Stack.Screen name="AdvertiseAll" component={AdvertiseAll} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        {/* <Stack.Screen name="Notification" component={Notification} /> */}
        <Stack.Screen name="Verification" component={VerificationPage} />
        <Stack.Screen name="CreateProduct" component={CreateProduct} />
        <Stack.Screen name="MyAccount" component={MyAccount} />
        <Stack.Screen name="SubCategoryMain" component={SubCategoryMain} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({route}) => ({
            headerTitle: route.params?.userName || 'Chat',
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerShown: true,
          })}
        />
        <Stack.Screen name="Inbox" component={InboxScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="BuyerNotification" component={BuyerNotification} />
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;
