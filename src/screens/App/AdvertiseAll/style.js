import {StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingHorizontal: mvs(16),
    paddingVertical: mvs(10),
    backgroundColor: colors.white,
    marginBottom: mvs(10),
  },
  header: {
    fontSize: mvs(16),
    // fontWeight: 'bold',
    color: colors.grey,
  },
  content: {
    paddingHorizontal: mvs(16),
    paddingBottom: mvs(20),
    backgroundColor: colors.white, // Ensure content area is white
  },
  IconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: mvs(60),
    height: mvs(60),
    marginRight: mvs(12),
  },

  // Enhanced shadow styles for subcategory items
  subCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: mvs(12),
    paddingVertical: mvs(20),
    paddingHorizontal: mvs(16),
    marginBottom: mvs(12),
    marginHorizontal: mvs(2), // Add horizontal margin for shadow visibility

    // Enhanced iOS Shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Enhanced Android Shadow
    elevation: 8,

    // Optional: Add a subtle border for definition
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  // Alternative deeper shadow for special items (like "All" category)
  subCategoryItemHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: mvs(12),
    paddingVertical: mvs(20),
    paddingHorizontal: mvs(16),
    marginBottom: mvs(12),
    marginHorizontal: mvs(2),

    // Deeper shadow for emphasis
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,

    // Subtle gradient-like effect with border
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  // Pressed state shadow (for touch feedback)
  subCategoryItemPressed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: mvs(12),
    paddingVertical: mvs(20),
    paddingHorizontal: mvs(16),
    marginBottom: mvs(12),
    marginHorizontal: mvs(2),

    // Reduced shadow for pressed state
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,

    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },

  subCategoryLeft: {
    flex: 1,
    justifyContent: 'center',
  },

  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  subCategoryText: {
    fontSize: mvs(15),
    color: '#333',
    fontWeight: '500',
  },
});

export default styles;
