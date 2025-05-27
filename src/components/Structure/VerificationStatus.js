import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {colors} from '../../util/color';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import API from '../../api/apiServices';
import {setVerificationStatus} from '../../redux/slices/userSlice';

const VerificationStatus = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {role, token, verificationStatus} = useSelector(state => state.user);

  useEffect(() => {
    if (role === 3 || !token || !isFocused) return;

    const fetchVerificationStatus = async () => {
      try {
        const response = await API.get('viewVerification', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const status = response.data?.data?.status ?? 0;
        dispatch(setVerificationStatus(status));
      } catch (error) {
        console.error('Verification API error:', error);
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === 'Unauthenticated'
        ) {
          dispatch(setVerificationStatus(0));
        }
      }
    };

    fetchVerificationStatus();
  }, [token, dispatch, isFocused, role]);

  const apiStatus = verificationStatus;

  if (!apiStatus && apiStatus !== 0) {
    return <ActivityIndicator size="small" color={colors.green} />;
  }

  if (apiStatus === 2) {
    return (
      <View style={styles.verifiedContainer}>
        <View style={styles.greenDot} />
        <Text style={styles.verifiedText}>{t('verified')}</Text>
      </View>
    );
  }

  if (apiStatus === 3) {
    return (
      <View style={styles.unverifiedContainer}>
        <View style={styles.redDot} />
        <Text style={styles.unverifiedText}>{t('rejected')}</Text>
      </View>
    );
  }

  if (apiStatus === 0) {
    return (
      <View style={styles.unverifiedContainer}>
        <View style={styles.redDot} />
        <Text style={styles.unverifiedText}>{t('unverified')}</Text>
      </View>
    );
  }

  if (apiStatus === 1) {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.InprogressContainer}>
          <View style={styles.orangeDot} />
          <Text style={styles.InprogressText}>{t('inProgress')}</Text>
        </View>
      </View>
    );
  }
};
const styles = StyleSheet.create({
  verifiedContainer: {
    backgroundColor: colors.lightpastelgreen,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  greenDot: {
    height: 8,
    width: 8,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  verifiedText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '500',
  },
  unverifiedContainer: {
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  redDot: {
    height: 8,
    width: 8,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: colors.red,
  },
  unverifiedText: {
    color: colors.red,
    fontSize: 14,
    fontWeight: '500',
  },
  InprogressContainer: {
    backgroundColor: colors.lightorange,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  orangeDot: {
    height: 8,
    width: 8,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  InprogressText: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 10,
    // marginBottom: 30,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  labelVerified: {
    fontSize: 13,
    color: colors.green,
    textAlign: 'center',
    flex: 1,
  },
  labelInProgress: {
    fontSize: 13,
    color: colors.black,
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  trackerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  stepCircleBase: {
    borderRadius: 20,
    borderWidth: 1,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  inProgressCircle: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF9800',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 20,
    color: colors.white,
  },
  circleTextBlack: {
    fontSize: 20,
    color: 'black',
  },
  inProgressCircleText: {
    fontSize: 20,
    color: '#FF9800',
  },
  lineBase: {
    width: '23%',
    height: 4,
    borderRadius: 2,
  },
  InprogressContainer: {
    backgroundColor: colors.lightorange,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  orangeDot: {
    height: 8,
    width: 8,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: colors.orange,
  },
  InprogressText: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 10, // marginBottom: 30,
  },
});

export default VerificationStatus;
