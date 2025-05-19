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
import {useNavigation} from '@react-navigation/native';
import SwitchModal from '../Modals/SwitchModal';
import {switchUserRole} from '../../api/apiServices'; // Updated to match the import from your document
const {height} = Dimensions.get('window');
const headerHeight = height * 0.28;

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

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.lightorange,
    height: headerHeight,
    paddingTop: StatusBar.currentHeight || 40,
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
    backgroundColor: '#ADBD6E',
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
    color: colors.black,
    fontWeight: 'bold',
    fontSize: mvs(20),
  },
  logo: {
    width: mvs(100),
    height: mvs(90),
    resizeMode: 'cover',
  },
});
console.log('ProfileHeader component rendered');
console.log('Active role:', activeRole);
console.log('Actual role:', actualRole);
console.log('Is seller on:', isSellerOn);
console.log('Modal visible:', modalVisible);
console.log('Is loading:', isLoading);
console.log('Snackbar visible:', snackbarVisible);
console.log('Snackbar message:', snackbarMessage);