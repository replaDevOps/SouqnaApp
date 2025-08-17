import {Dimensions, StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const {width} = Dimensions.get('window');
const CARD_MARGIN = mvs(8);
const cardWidth = (width - CARD_MARGIN * 4 - mvs(16) * 2) / 2;

// Reusable shadow style
const shadowStyle = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 4},
  shadowOpacity: 0.12,
  shadowRadius: 6,
  elevation: 6,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingBottom: 40,
  },
  categoryList: {
    paddingHorizontal: mvs(16),
    paddingTop: mvs(18),
    paddingBottom: mvs(18),
  },
  categoryItem: {
    width: cardWidth,
    aspectRatio: 1.1,
    marginHorizontal: CARD_MARGIN,
    marginBottom: mvs(16),
    backgroundColor: colors.white,
    borderRadius: mvs(12),
    paddingTop: mvs(10),
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...shadowStyle, // Apply the unified shadow
  },
  IconContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: mvs(105),
    marginBottom: mvs(18),
  },
  categoryText: {
    fontSize: mvs(14),
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: mvs(6),
    lineHeight: mvs(16),
  },
  rowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: mvs(4),
  },
  expandedCategoryItem: {
    width: '100%',
    marginBottom: mvs(16),
    backgroundColor: '#eef6ff',
    borderRadius: mvs(12),
    padding: mvs(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    ...shadowStyle, // Shadow on expanded card too
  },
  expandedContent: {
    marginTop: mvs(10),
  },
});

export default styles;
