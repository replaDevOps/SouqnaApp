import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {colors} from '../../util/color';
import {useDispatch, useSelector} from 'react-redux'; // If you're storing token in Redux
import {setVerificationStatus} from '../../redux/slices/userSlice';

const VerificationStatus = () => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get token from Redux or props
  const {token} = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const response = await axios.get(
          'https://backend.souqna.net/api/viewVerification',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          dispatch(setVerificationStatus(status));
        }
        if (response.data.success) {
          const apiStatus = response.data.data.status || response.data.data;
          setStatus(apiStatus);
          console.log('api Status: ', apiStatus);
        }
      } catch (error) {
        console.error('Verification API error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [token, dispatch, status]);

  const isStepCompleted = stepNumber => {
    return status >= stepNumber;
  };

  const getStepCircleStyle = stepNumber => {
    return {
      ...styles.stepCircleBase,
      backgroundColor: isStepCompleted(stepNumber)
        ? colors.lightgreen
        : colors.white,
      borderColor: isStepCompleted(stepNumber) ? colors.green : 'gray',
    };
  };

  const getLineStyle = stepNumber => {
    return {
      ...styles.lineBase,
      backgroundColor: isStepCompleted(stepNumber)
        ? colors.lightgreen
        : colors.grey,
    };
  };

  if (loading) {
    return <ActivityIndicator size="small" color={colors.green} />;
  }

  if (status === 2) {
    return (
      <View style={styles.verifiedContainer}>
        <View style={styles.greenDot} />
        <Text style={styles.verifiedText}>Verified</Text>
      </View>
    );
  }

  if (status === 3) {
    return (
      <View style={styles.unverifiedContainer}>
        <View style={styles.redDot} />
        <Text style={styles.unverifiedText}>Rejected</Text>
      </View>
    );
  }

  if (status === 0) {
    return (
      <View style={styles.unverifiedContainer}>
        <View style={styles.redDot} />
        <Text style={styles.unverifiedText}>Unverified</Text>
      </View>
    );
  }

  // status === 1 (In Progress)
  return (
    <View style={styles.progressContainer}>
      <View style={styles.labelsContainer}>
        <Text style={styles.labelVerified}>Unverified</Text>
        <Text style={styles.labelInProgress}>In Progress</Text>
        <Text style={styles.labelVerified}>Verified</Text>
      </View>

      <View style={styles.trackerContainer}>
        <View style={getStepCircleStyle(0)}>
          <Text style={styles.circleText}>1</Text>
        </View>
        <View style={getLineStyle(1)} />
        <View style={styles.inProgressCircle}>
          <Text style={styles.inProgressCircleText}>2</Text>
        </View>
        <View style={getLineStyle(2)} />
        <View style={getStepCircleStyle(2)}>
          <Text style={styles.circleTextBlack}>3</Text>
        </View>
      </View>
    </View>
  );
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
  progressContainer: {
    paddingHorizontal: 10,
    marginBottom: 30,
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
});

export default VerificationStatus;
