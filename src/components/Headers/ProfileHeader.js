import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../util/color';
import {mvs} from '../../util/metrices';
import {OffSVG, PowerOffSVG, SouqnaLogo} from '../../assets/svg';
import OnSVG from '../../assets/svg/OnSVG';
import {t} from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setActualRole, setRole} from '../../redux/slices/userSlice';
import {Snackbar} from 'react-native-paper';
import {CommonActions, useNavigation} from '@react-navigation/native';
import SwitchModal from '../Modals/SwitchModal';
import {switchUserRole} from '../../api/apiServices'; // Updated to match the import from your document
import {SafeAreaView} from 'react-native-safe-area-context';
import {showSnackbar} from '../../redux/slices/snackbarSlice';
// const {height} = Dimensions.get('window');

// const headerHeight = height * 0.28;

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
    // Trigger parent loading indicator
    if (onRoleSwitch) {
      onRoleSwitch();
    }

    const isCurrentlySeller = activeRole === '2' || activeRole === 2;
    const isCurrentlyBuyer = activeRole === '3' || activeRole === 3;

    // If actual role is 4 (has both buyer and seller)
    if (actualRole === '4' || actualRole === 4) {
      // Just switch without showing modal
      const newRole = isCurrentlySeller ? 3 : 2;
      const newSellerState = !isCurrentlySeller;

      dispatch(setRole(newRole));
      setIsSellerOn(newSellerState);

      const message = newSellerState
        ? t('Switched to Seller Account')
        : t('Switched to Buyer Account');

      dispatch(showSnackbar(message));
      setSnackbarVisible(true);
    } else if (
      actualRole === '2' ||
      actualRole === 2 ||
      actualRole === '3' ||
      actualRole === 3
    ) {
      // Only show modal for standard buyer/seller switching
      setModalVisible(true);
    } else {
      dispatch(showSnackbar(t('Role switching not permitted.')));
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
        dispatch(showSnackbar(response.error || t('Failed to switch account')));
      }
    } catch (error) {
      console.error('Error in handleModalSubmit:', error);
      dispatch(showSnackbar(t('An error occurred. Please try again.')));
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
    dispatch(showSnackbar(message));

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
    <SafeAreaView style={styles.headerContainer}>
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
      {/* <View style={styles.sellerContainer}>
        <Text style={styles.sellerText}>
          {activeRole === '2' || activeRole === 2
            ? t('Seller Account')
            : activeRole === '3' || activeRole === 3
            ? t('buyeraccount')
            : isSellerOn
            ? t('Seller Account')
            : t('buyeraccount')}
        </Text>
        <TouchableOpacity onPress={toggleSellerMode} activeOpacity={0.8}>
          {isSellerOn ? (
            <OnSVG width={mvs(40)} height={mvs(45)} fill={colors.white} />
          ) : (
            <OffSVG width={mvs(40)} height={mvs(45)} fill={colors.gray} />
          )}
        </TouchableOpacity>
      </View> */}
      {/* Snackbar for showing role change messages */}
      {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_LONG}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}>
        {snackbarMessage}
      </Snackbar> */}
      {/* Modal for role switching - pass token and password props */}
      {/* <SwitchModal
        visible={modalVisible}
        onClose={handleModalClose}
        role={activeRole}
        token={token}
        password={password}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.lightorange,
    // height: headerHeight,
    // paddingTop: 40,
    paddingHorizontal: mvs(15),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: mvs(8),
  },
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: mvs(45),
  },
  appTitle: {
    marginLeft: mvs(10),
    fontWeight: 'bold',
    fontSize: mvs(24),
    color: colors.green,
  },
  sellerContainer: {
    backgroundColor: '#008e91',
    flexDirection: 'row',
    paddingHorizontal: mvs(8),
    borderRadius: mvs(10),
    paddingVertical: mvs(0),
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    left: 20,
    right: 20,
  },
  sellerText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: mvs(20),
  },
  logo: {
    width: mvs(100),
    height: mvs(90),
    resizeMode: 'cover',
  },
});
