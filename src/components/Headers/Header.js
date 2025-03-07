import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {BackSVG} from '../../assets/svg';
import Regular from '../../typography/RegularText';
import {colors} from '../../util/color';
import HelpModal from '../Modals/HelpModal';

const Header = ({title, showBackButton = false, onBackPress}) => {
  const [showHelp, setShowHelp] = useState(false);

  const openHelp = () => {
    setShowHelp(true);
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  return (
    <View style={styles.container}>
      {showBackButton ? (
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
          <BackSVG width={25} height={25} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <TouchableOpacity onPress={openHelp}>
        <Regular style={styles.title}>{title}</Regular>
      </TouchableOpacity>

      <HelpModal visible={showHelp} onClose={closeHelp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    height: hp(8),
  },
  backButton: {
    // padding: 8,
  },
  title: {
    color: colors.green,
    fontSize: 16,
  },
  rightContainer: {
    padding: 8,
  },
  placeholder: {
    width: 24, // Same as Icon size for proper alignment
  },
});

export default Header;
