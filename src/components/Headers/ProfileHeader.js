import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../util/color';
import { mvs } from '../../util/metrices';
import { OffSVG, PowerOffSVG, SouqnaLogo } from '../../assets/svg';
import OnSVG from '../../assets/svg/OnSVG';
import { t } from 'i18next';

const { height } = Dimensions.get('window');
const headerHeight = height * 0.20;

export default function ProfileHeader({ OnPressLogout }) {
  const [isSellerOn, setIsSellerOn] = useState(true);

  const toggleSellerMode = () => {
    setIsSellerOn(prev => !prev);
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={OnPressLogout} style={styles.logoutButton}>
        <PowerOffSVG width={mvs(25)} height={mvs(25)} fill={colors.white} />
      </TouchableOpacity>

      <View style={styles.logoRow}>
        <View style={styles.logoWrapper}>
          <SouqnaLogo width={mvs(50)} height={mvs(50)} />
        </View>
        <Text style={styles.appTitle}>{t('Souqna App')}</Text>
      </View>

      <View style={styles.sellerContainer}>
        <Text style={styles.sellerText}>{t('Seller Account')}</Text>
        <TouchableOpacity onPress={toggleSellerMode} activeOpacity={0.8}>
          {isSellerOn ? (
            <OnSVG width={mvs(40)} height={mvs(45)} fill={colors.lightpastelgreen} />
          ) : (
            <OffSVG width={mvs(40)} height={mvs(45)} fill={colors.gray} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.lightgreen,
    height: headerHeight,
    paddingTop: mvs(30),
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
    flexDirection: 'row',
    marginBottom: mvs(40),
  },
  logoWrapper: {
    backgroundColor: '#e1e1e1',
    borderRadius: mvs(30),
    width: mvs(60),
    height: mvs(60),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  appTitle: {
    marginLeft: mvs(10),
    fontWeight: 'bold',
    fontSize: mvs(24),
    color: colors.green,
  },
  sellerContainer: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    paddingHorizontal: mvs(8),
    borderRadius: mvs(18),
    paddingVertical: mvs(0),
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    left: 25,
    right: 25,
  },
  sellerText: {
    color: colors.white,
    fontSize: mvs(20),
  },
});
