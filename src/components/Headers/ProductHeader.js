import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  ToastAndroid,
  Clipboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackSVG, HeartSVG, OpenSVG} from '../../assets/svg'; // Replace these with your actual imports
import {mvs} from '../../util/metrices';
import {colors} from '../../util/color';
import {useSelector} from 'react-redux';

const {width} = Dimensions.get('window');
const ProductHeader = ({
  title,
  onHeartPress,
  id,
  product,
  headerTitleVisible,
  productLink,
}) => {
  const navigation = useNavigation();
  const {role} = useSelector(state => state.user);

  const onHeartPressHandler = () => {
    // Call the function passed as a prop with the correct parameters
    onHeartPress(id, product);
  };
  const handleCopyLink = () => {
    Clipboard.setString(productLink);
    ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.headerWrapper}>
      <View
        style={[
          styles.headerContainer,
          headerTitleVisible && styles.headerTitleVisible,
        ]}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.lightgreen,
            padding: mvs(4),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: mvs(23),
            width: mvs(40),
            height: mvs(40),
          }}
          onPress={() => navigation.goBack()}>
          <BackSVG width={30} fill={'white'} height={30} />
        </TouchableOpacity>

        {headerTitleVisible && title && (
          <Text style={styles.headerTitle}>{title}</Text>
        )}

        {/* Icons Container: Heart and Open icons
        <View style={styles.iconsContainer}>
          {role !== 2 && (
            <TouchableOpacity onPress={onHeartPressHandler}>
              <HeartSVG width={24} height={24} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.openIconContainer}
            onPress={handleCopyLink}>
            <OpenSVG width={24} height={24} />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default ProductHeader;

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent', // Initially transparent
    paddingHorizontal: mvs(10),
    justifyContent: 'space-between', // Ensures proper space between the items
    alignItems: 'center', // Vertically centers the icons in the row
    height: mvs(60),
    flexDirection: 'row', // Aligns everything in the same row
  },
  headerTitleVisible: {
    backgroundColor: colors.white, // White background when the title is visible
  },
  headerTitle: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    flex: 1, // Makes the title take up remaining space in the header
  },
  iconsContainer: {
    flexDirection: 'row', // Ensures that the Heart and Open icons are in the same row
    alignItems: 'center', // Ensures that the icons are vertically centered
  },
  openIconContainer: {
    marginLeft: mvs(10), // Adds space between the Heart and Open icons
  },
});
