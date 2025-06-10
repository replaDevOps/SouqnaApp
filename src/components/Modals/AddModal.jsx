import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Linking,
  Dimensions,
} from 'react-native';
import {CloseSvg, SouqnaLogo} from '../../assets/svg';
import {colors} from '../../util/color';
import Regular from '../../typography/RegularText';
import {mvs} from '../../util/metrices';
import dummyData from '../../util/dummyData';
import {useNavigation} from '@react-navigation/native';
import HelpModal from './HelpModal';

const AddModal = ({visible, onClose, title, message}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {paginationImages} = dummyData;
  const [showHelp, setShowHelp] = useState(false);
  const navigation = useNavigation();
  const {width: SCREEN_WIDTH} = Dimensions.get('window');

  const renderItem = ({item}) => (
    // <View style={[styles.imageContainer, {width: SCREEN_WIDTH}]}>
    <View
      style={[styles.imageContainer, {width: Dimensions.get('window').width}]}>
      <Image source={item.imageUrl} style={styles.image} />
      <Regular style={styles.infoText}>{item.description}</Regular>
    </View>
  );

  const onViewableItemsChanged = React.useRef(({viewableItems}) => {
    const firstVisibleItem = viewableItems[0];
    if (firstVisibleItem) {
      setCurrentIndex(firstVisibleItem.index);
    }
  });

  const handleRegister = () => {
    navigation.replace('Register');
  };
  const handleLogin = () => {
    navigation.replace('Login');
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  const openHelp = () => {
    setShowHelp(true);
  };

  const closeHelp = () => {
    setShowHelp(false);
  };

  const openUrl = url => {
    Linking.openURL(url);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerSection}>
            <TouchableOpacity onPress={onClose}>
              <CloseSvg width={mvs(24)} height={mvs(24)} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openHelp}>
              <Text style={styles.helpText}>{t('Help')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logoAndTitleContainer}>
            {/* <SouqnaLogo width={40} height={40} /> */}
            <Image
              source={require('../../assets/img/logo1.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Souqna</Text>
          </View>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.carouselSection}>
            <FlatList
              data={paginationImages}
              renderItem={renderItem}
              horizontal
              pagingEnabled
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              snapToInterval={SCREEN_WIDTH} // <-- Important!
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
              })}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={viewabilityConfig}
            />
          </View>

          <View style={styles.footerSection}>
            <View style={styles.pagination}>
              {paginationImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleRegister}>
              <Regular style={styles.closeButtonText}>{t('Register')}</Regular>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Regular style={styles.LoginButtonText}>{t('Login')}</Regular>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              {t('ourTermsApplyPart1')}{' '}
              <TouchableOpacity
                onPress={() =>
                  openUrl(
                    'https://themen.kleinanzeigen.de/nutzungsbedingungen/',
                  )
                }>
                <Text style={styles.termsLink}> {t('ourTermsApplyPart3')}</Text>
              </TouchableOpacity>{' '}
               {t('ourTermsApplyPart2')}{' '}
              <TouchableOpacity
                onPress={() =>
                  openUrl(
                    'https://themen.kleinanzeigen.de/datenschutzerklaerung/',
                  )
                }>
                <Text style={styles.termsLink}> {t('ourTermsApplyPart4')}</Text>
              </TouchableOpacity>
              .
            </Text>
          </View>
        </View>
        <HelpModal visible={showHelp} onClose={closeHelp} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logo: {
    width: 45,
    height: 45,
  },
  modalContainer: {
    backgroundColor: colors.white,
    paddingTop: mvs(30),
    paddingHorizontal: mvs(20),
    flex: 1,
  },
  // Header Section (0.2 flex)
  headerSection: {
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: mvs(20),
  },
  logoAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: mvs(20),
  },
  title: {
    fontSize: mvs(28),
    fontWeight: 'bold',
    color: colors.green,
    marginLeft: mvs(10),
  },
  message: {
    fontSize: mvs(16),
    color: colors.black,
    textAlign: 'center',
    marginBottom: mvs(20),
  },
  helpText: {
    color: colors.green,
    fontSize: mvs(16),
    fontWeight: 'bold',
  },
  // Image Carousel Section (0.5 flex)
  carouselSection: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginBottom: mvs(40),
  },
  image: {
    width: mvs(373),
    height: mvs(250),
    resizeMode: 'contain',
    borderRadius: mvs(10),
  },
  infoText: {
    textAlign: 'center',
    marginTop: mvs(15),
    fontSize: mvs(16),
    marginRight: mvs(20),
    paddingHorizontal: mvs(10), // prevents text from touching screen edges
    maxWidth: '80%',
  },
  pagination: {
    flexDirection: 'row',
    marginVertical: mvs(20),
  },
  paginationDot: {
    width: mvs(8),
    height: mvs(8),
    borderRadius: mvs(4),
    backgroundColor: colors.grey,
    marginHorizontal: mvs(5),
  },
  activeDot: {
    backgroundColor: colors.green,
  },
  // Footer Section (0.3 flex)
  footerSection: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: colors.lightgreen,
    padding: mvs(12),
    borderRadius: mvs(25),
    // marginTop: mvs(20),
    width: '95%',
    alignSelf: 'center',
  },
  closeButtonText: {
    color: colors.white,
    fontSize: mvs(16),
    textAlign: 'center',
  },
  LoginButtonText: {
    color: colors.green,
    fontSize: mvs(16),
    textAlign: 'center',
  },
  loginButton: {
    padding: mvs(12),
    borderRadius: mvs(5),
    marginTop: mvs(10),
    width: '95%',
    alignSelf: 'center',
  },
  termsText: {
    color: colors.grey,
    fontSize: mvs(14),
    marginTop: mvs(20),
    textAlign: 'left',
  },
  termsLink: {
    color: colors.green,
    textDecorationLine: 'underline',
    lineHeight: mvs(10), // Match the lineHeight to the regular text
    paddingTop: 0, // Make sure no padding is pushing the text up
  },
});

export default AddModal;
