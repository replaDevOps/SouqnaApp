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
import AllCategories from '../../screens/App/SearchAll';
import SubCategoryScreen from '../../screens/App/SubCategory';
import ChangePassword from '../../screens/App/ChangePassword';
import AdvertiseAll from '../../screens/App/AdvertiseAll';
import Notification from '../../screens/App/Notification';
import VerificationPage from '../../screens/Auth/Verification';
import CreateProduct from '../../screens/App/Product/CreateProduct';
import BuyerLogin from '../../screens/Auth/BuyerLogin';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BuyerLogin" component={BuyerLogin} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={MyTabs} />

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
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Verification" component={VerificationPage} />
        <Stack.Screen name="CreateProduct" component={CreateProduct} />
      </Stack.Navigator>
    </View>
  );
};

export default AppNavigator;
