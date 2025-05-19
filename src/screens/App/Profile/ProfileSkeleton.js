import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../../../util/color';
import { mvs } from '../../../util/metrices';

class ProfileSkeleton extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  render() {
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.6],
    });

    return (
      <View style={styles.container}>
        {/* Verification Status Skeleton */}
        <Animated.View style={[styles.verificationBox, { opacity }]} />

        {/* Menu Items Skeleton */}
        <View style={styles.menuContainer}>
          <Animated.View style={[styles.sectionTitle, { opacity }]} />
          
          {/* Menu Item 1 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 2 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 3 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 4 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
          
          {/* Menu Item 5 */}
          <View style={styles.menuItemContainer}>
            <View style={styles.leftRow}>
              <Animated.View style={[styles.iconPlaceholder, { opacity }]} />
              <Animated.View style={[styles.textPlaceholder, { opacity }]} />
            </View>
            <Animated.View style={[styles.arrowPlaceholder, { opacity }]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: mvs(10),
  },
  verificationBox: {
    width: '100%',
    height: mvs(80),
    backgroundColor: '#e0e0e0',
    borderRadius: mvs(10),
    marginVertical: mvs(15),
  },
  menuContainer: {
    marginTop: mvs(15),
  },
  sectionTitle: {
    width: mvs(80),
    height: mvs(20),
    backgroundColor: '#e0e0e0',
    borderRadius: mvs(5),
    marginBottom: mvs(15),
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: mvs(24),
    height: mvs(24),
    backgroundColor: '#e0e0e0',
    borderRadius: mvs(12),
    marginRight: mvs(15),
  },
  textPlaceholder: {
    width: mvs(120),
    height: mvs(18),
    backgroundColor: '#e0e0e0',
    borderRadius: mvs(5),
  },
  arrowPlaceholder: {
    width: mvs(20),
    height: mvs(20),
    backgroundColor: '#e0e0e0',
    borderRadius: mvs(5),
  },
});

export default ProfileSkeleton;
