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
import CustomText from '../CustomText';

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
        {/* Back button - left aligned */}
        <TouchableOpacity
          style={styles.leftIcon}
          onPress={() => navigation.goBack()}>
          <BackSVG width={30} fill={'white'} height={30} />
        </TouchableOpacity>

        {/* Title - centered */}
        {headerTitleVisible && title && (
          <View style={styles.titleWrapper}>
            <CustomText style={styles.headerTitle} numberOfLines={1}>
              {title}
            </CustomText>
          </View>
        )}

        {/* Right icons - Heart and Open */}
        {/* Uncomment when needed */}
        {/* <View style={styles.rightIconGroup}>
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
    zIndex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
    height: mvs(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleVisible: {
    backgroundColor: colors.white,
  },
  titleWrapper: {
    position: 'absolute',
    left: 60,
    right: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: mvs(10),
    top: '50%',
    transform: [{translateY: -20}],
    backgroundColor: colors.lightgreen,
    padding: mvs(4),
    borderRadius: mvs(23),
    width: mvs(40),
    height: mvs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconGroup: {
    position: 'absolute',
    right: mvs(10),
    top: '50%',
    transform: [{translateY: -12}],
    flexDirection: 'row',
    alignItems: 'center',
  },
  openIconContainer: {
    marginLeft: mvs(10),
  },
});
