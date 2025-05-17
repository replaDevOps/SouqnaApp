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
import {setRole} from '../../redux/slices/userSlice';
import {Snackbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import SwitchModal from '../Modals/SwitchModal';
import { switchUserRole } from '../../api/apiServices'; // Updated to match the import from your document

const {height} = Dimensions.get('window');
const headerHeight = height * 0.28;

export default function ProfileHeader({OnPressLogout}) {
  const {token, role, password} = useSelector(state => state.user);
  const [isSellerOn, setIsSellerOn] = useState(role === '2' || role === 2);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const dispatch = useDispatch();
  const [fadeAnim] = useState(new Animated.Value(1));
  const navigation = useNavigation();

  useEffect(() => {
    // If user is seller (2) or in dual mode (4) and isSellerOn is true, set isSellerOn to true
    // Otherwise set it to false
    if (role === '2' || role === 2 || (role === '4' || role === 4) && isSellerOn) {
      setIsSellerOn(true);
    } else {
      setIsSellerOn(false);
    }
  }, [role]);

  const toggleSellerMode = () => {
    // If role is 4 (both seller and buyer), directly switch between seller (2) and buyer (3)
    if (role === '4' || role === 4) {
      // Toggle between seller and buyer roles
      const newRole = isSellerOn ? '3' : '2';
      dispatch(setRole(newRole));
      setIsSellerOn(!isSellerOn);
      
      // Show appropriate message
      const message = isSellerOn 
        ? t('Switched to Buyer Account') 
        : t('Switched to Seller Account');
      
      setSnackbarMessage(message);
      setSnackbarVisible(true);
    } else {
      // Show modal for role 2 (seller) or 3 (buyer)
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
    // Determine the new role based on current role - Always set to role 4 per your API logic
    const newRole = '4';
    
    // Set message based on the previous role
    const message = (role === '2' || role === 2) 
      ? t('Switched to Buyer Account') 
      : t('Switched to Seller Account');
    
    // Update snackbar message and show it
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    
    // Update the role in Redux store
    dispatch(setRole(newRole));
    
    // Update local state for the toggle button
    setIsSellerOn(false); // Reset since we're now role 4

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
        backgroundColor="#ffffff" // Make sure this matches your background
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
          {role === '2' || role === 2
            ? t('Seller Account')
            : role === '3' || role === 3
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
        role={role}
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