import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const {width} = Dimensions.get('window');

const InboxSkeleton = ({count = 6}) => {
  // Animation value for the shimmer effect
  const shimmerValue = useRef(new Animated.Value(0)).current;

  // Start the animation when component mounts
  useEffect(() => {
    const startShimmerAnimation = () => {
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ).start();
    };

    startShimmerAnimation();
    return () => shimmerValue.stopAnimation();
  }, [shimmerValue]);

  // Interpolated values for the shimmer effect
  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.skeletonContainer}>
      {/* Generate requested number of message skeleton items */}
      {[...Array(count)].map((_, index) => (
        <View key={index} style={styles.messageContainer}>
          <View style={styles.messageHeader}>
            {/* Profile image placeholder */}
            <View style={styles.profileImageSkeleton}>
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{translateX}],
                  },
                ]}
              />
            </View>

            <View style={styles.messageHeaderInfo}>
              {/* Name placeholder */}
              <View style={styles.senderNameSkeleton}>
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{translateX}],
                    },
                  ]}
                />
              </View>

              {/* Message text placeholder */}
              <View style={styles.messageTextSkeleton}>
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      transform: [{translateX}],
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <View style={styles.messageBody}>
            {/* Time placeholder */}
            <View style={styles.timeTextSkeleton}>
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{translateX}],
                  },
                ]}
              />
            </View>

            {/* Unread badge placeholder */}
            <View style={styles.unreadBadgeSkeleton}>
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{translateX}],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    gap: 12,
    // paddingHorizontal: mvs(10),
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: mvs(12),
    paddingHorizontal: mvs(16),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageSkeleton: {
    width: mvs(50),
    height: mvs(50),
    borderRadius: mvs(25),
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  messageHeaderInfo: {
    marginLeft: mvs(12),
    flex: 1,
  },
  senderNameSkeleton: {
    height: mvs(14),
    backgroundColor: '#E0E0E0',
    borderRadius: mvs(4),
    marginBottom: mvs(6),
    width: '60%',
    overflow: 'hidden',
  },
  messageTextSkeleton: {
    height: mvs(12),
    backgroundColor: '#E0E0E0',
    borderRadius: mvs(4),
    width: '40%',
    overflow: 'hidden',
  },
  messageBody: {
    alignItems: 'flex-end',
    marginLeft: mvs(10),
  },
  timeTextSkeleton: {
    height: mvs(10),
    backgroundColor: '#E0E0E0',
    borderRadius: mvs(4),
    marginBottom: mvs(6),
    width: mvs(40),
    overflow: 'hidden',
  },
  unreadBadgeSkeleton: {
    width: mvs(24),
    height: mvs(24),
    borderRadius: mvs(12),
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  shimmer: {
    width: '200%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default InboxSkeleton;
