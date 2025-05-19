This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


I have made a skeleton and i want whenever the toggleseller is pressed the skeleton should appear in the profile under the profile header.
I have applied some logic but it is not correct 
profile is a parent screen and 
=======>


export default function ProfileHeader({OnPressLogout, onRoleSwitch}) {
  const {
    token,
    role: activeRole,
    password,
    actualRole,
  } = useSelector(state => state.user);
  const [isSellerOn, setIsSellerOn] = useState(
    activeRole === '2' || activeRole === 2,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const dispatch = useDispatch();
  const [fadeAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();
  console.log('{Role Switch}', onRoleSwitch);
  
  useEffect(() => {
    setIsSellerOn(activeRole === '2' || activeRole === 2);
  }, [activeRole]);

  const toggleSellerMode = () => {
    // First, trigger the skeleton loading via parent component
    if (onRoleSwitch) {
      onRoleSwitch();
    }

    if (actualRole === '4' || actualRole === 4) {
      let newRole;
      let newSellerState;

      if (isSellerOn) {
        // If currently seller and toggling -> switch to buyer (role 3)
        newRole = '3';
        newSellerState = false;
      } else {
        // If currently buyer and toggling back -> switch to seller (role 2)
        newRole = '2';
        newSellerState = true;
      }

      dispatch(setRole(newRole));
      setIsSellerOn(newSellerState);

      const message = newSellerState
        ? t('Switched to Seller Account')
        : t('Switched to Buyer Account');
      setSnackbarMessage(message);
      setSnackbarVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };
  const handleModalSubmit = async (token, currentRole, sellerType = null) => {
    try {
      setIsLoading(true);
      // Call the API function to switch roles
      const response = await switchUserRole(token, currentRole, sellerType);
      // Check if the response indicates success
      if (response && !response.success === false) {
        // Close modal and update role
        setModalVisible(false);
        updateRole();
      } else {
        // Show error message in snackbar
        setSnackbarMessage(response.error || t('Failed to switch account'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error in handleModalSubmit:', error);
      setSnackbarMessage(t('An error occurred. Please try again.'));
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };
  const updateRole = () => {
    // Update to role 4 when upgrading from 2 or 3
    // Trigger the skeleton loading via parent component when updating role
    if (onRoleSwitch) {
      onRoleSwitch();
    }
    dispatch(setActualRole('4'));
    // Set message based on the previous role
    const message =
      activeRole === '2' || activeRole === 2
        ? t('Switched to Buyer Account')
        : t('Switched to Seller Account');
    // Update snackbar message and show it
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    // Update local state for the toggle button
    setIsSellerOn(activeRole === '3' || activeRole === 3); // Reset since we're now role 4
    // Fade-out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  

  return (
    <View style={styles.headerContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF" // Make sure this matches your background
        translucent={false}
      />
      <TouchableOpacity onPress={OnPressLogout} style={styles.logoutButton}>
        <PowerOffSVG width={mvs(25)} height={mvs(25)} fill={colors.white} />
      </TouchableOpacity>
      <View style={styles.logoWrapper}>
        <Image
          source={require('../../assets/img/logo1.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.sellerContainer}>
        <Text style={styles.sellerText}>
          {activeRole === '2' || activeRole === 2
            ? t('Seller Account')
            : activeRole === '3' || activeRole === 3
            ? t('Buyer Account')
            : isSellerOn
            ? t('Seller Account')
            : t('Buyer Account')}
        </Text>
        <TouchableOpacity onPress={toggleSellerMode} activeOpacity={0.8}>
          {isSellerOn ? (
            <OnSVG width={mvs(40)} height={mvs(45)} fill={colors.white} />
          ) : (
            <OffSVG width={mvs(40)} height={mvs(45)} fill={colors.gray} />
          )}
        </TouchableOpacity>
      </View>
      {/* Snackbar for showing role change messages */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_LONG}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar>
      {/* Modal for role switching - pass token and password props */}
      <SwitchModal
        visible={modalVisible}
        onClose={handleModalClose}
        role={activeRole}
        token={token}
        password={password}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </View>
  );
}


----------->
const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    token,
    verificationStatus,
    role: activeRole,
    actualRole,
  } = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [localStatus, setLocalStatus] = useState(null);
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  const isFocused = useIsFocused();
  const fetchVerificationStatus = async () => {
    if (!token) return;
    setVerificationLoading(true);

    try {
      const response = await API.get('viewVerification', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const apiStatus =
          response.data?.data?.status ?? response.data?.data ?? 'unverified';
        dispatch(setVerificationStatus(apiStatus));
        setLocalStatus(apiStatus);

        console.log('Fetched verification status: ', apiStatus);
      } else {
        setLocalStatus(0);
      }
    } catch (error) {
      console.error('Verification API error:', error);
      setLocalStatus(0);
    } finally {
      setVerificationLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (activeRole === '2') {
        fetchVerificationStatus();
      } else {
        // Reset visibility when switching to other roles
        setLocalStatus(null);
      }
    }, [activeRole]),
  );

   // Function to handle role switching
  const handleRoleSwitching = () => {
    setIsRoleSwitching(true);
    setTimeout(() => {
      setIsRoleSwitching(false);
    }, 1500); // Show skeleton for 1.5 seconds
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeRole === '2') {
      await fetchVerificationStatus();
    }
    setRefreshing(false);
    console.log('Profile Refreshed');
  };

  const handleLogout = () => {
    dispatch(logoutUser());

    navigation.replace('Login');
  };
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const {t, i18n} = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    const isArabic = newLang === 'ar';

    try {
      await AsyncStorage.setItem('appLanguage', newLang); // Save selected language

      const shouldForceRTL = I18nManager.isRTL !== isArabic;

      if (shouldForceRTL) {
        I18nManager.allowRTL(isArabic);
        I18nManager.forceRTL(isArabic);
      }

      i18n.changeLanguage(newLang).then(() => {
        Alert.alert(
          isArabic ? 'تم التغيير' : 'Language Changed',
          isArabic
            ? 'سيتم إعادة تشغيل التطبيق لتطبيق اللغة العربية.'
            : 'App will reload to apply English language.',
          [
            {
              text: isArabic ? 'موافق' : 'OK',
              onPress: () => RNRestart.restart(),
            },
          ],
        );
      });
    } catch (error) {
      console.error('Language toggle error:', error);
    }
  };

  const renderDirectionalIcon = () => {
    if (I18nManager.isRTL) {
      return <BackwardSVG width={24} height={24} stroke={colors.green} />;
    }
    return <ForwardSVG width={24} height={24} fill={colors.green} />;
  };

  

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#fff'}}
      contentContainerStyle={styles.Scrollcontainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={50}
        />
      }>
      <View style={{backgroundColor: '#fff', elevation: 0, shadowOpacity: 0}}>
        <ProfileHeader OnPressLogout={handleLogout} onRoleSwitch={handleRoleSwitching}  />
      </View>

      <View style={styles.container}>
        {activeRole === '2' && (
          <VerificationStatus
            status={localStatus}
            // loading={verificationLoading}
          />
        )}
         {
          isRoleSwitching ?(
            <ProfileSkeleton />
          ):
        <View style={styles.content}>
          <Regular style={styles.regularText}>{t('general')}</Regular>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={() => navigation.navigate('MyAccount')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ProfileSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>{t('myAccount')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            {(activeRole === '2' || activeRole === 2) && actualRole === 4 ? (
              <TouchableOpacity
                style={styles.menuItemContainer}
                onPress={() => navigation.navigate('Verification')}>
                <View style={styles.leftRow}>
                  <View style={styles.iconWrapper}>
                    <VerifiedSVG width={22} height={22} />
                  </View>
                  <Regular style={styles.menuText}>
                    {verificationStatus === 'verified'
                      ? t('updateProfile')
                      : t('getVerified')}
                  </Regular>
                </View>
                {renderDirectionalIcon()}
              </TouchableOpacity>
            ) : (
              ''
            )}

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={handleChangePassword}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ChangePassSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>{t('changePassword')}</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={toggleLanguage}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <LanguageSVG width={24} height={24} />
                </View>
                <Regular style={styles.menuText}>
                  {i18n.language === 'en'
                    ? t('switchToArabic')
                    : t('switchToEnglish')}
                </Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={()=> navigation.navigate('Plans')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ChangePassSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>Subscription Plans</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemContainer}
              onPress={()=> navigation.navigate('Card')}>
              <View style={styles.leftRow}>
                <View style={styles.iconWrapper}>
                  <ChangePassSVG width={22} height={22} />
                </View>
                <Regular style={styles.menuText}>cardPlans</Regular>
              </View>
              {renderDirectionalIcon()}
            </TouchableOpacity>
          </View>
        </View>
         }
      </View>
    </ScrollView>
  );
};
=========>
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../../util/color';
import { mvs } from '../../../util/metrices';

class ProfileSkeleton extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  render() {
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    return (
      <View style={styles.container}>
        {/* Verification Status Skeleton */}
        <Animated.View style={[styles.verificationBox, { opacity }]} />

        {/* Menu Items Skeleton */}
        <View style={styles.menuContainer}>
          <Animated.View style={[styles.sectionTitle, { opacity }]} />
          
          {/* Menu Item 1 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 2 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 3 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 4 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 5 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
        </View>
      </View>
    );
  }
}