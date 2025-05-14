import {Dimensions, StyleSheet} from 'react-native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';

const {width} = Dimensions.get('window');
const CARD_MARGIN = mvs(8);
const cardWidth = (width - CARD_MARGIN * 4 - mvs(16) * 2) / 2;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingBottom: 15,
  },
  categoryList: {
    paddingHorizontal: mvs(16),
    paddingTop: mvs(10),
    paddingBottom: mvs(24),
  },
  categoryItem: {
    width: cardWidth,
    aspectRatio: 1, // Keeps card square
    marginHorizontal: CARD_MARGIN,
    marginBottom: mvs(16),
    backgroundColor: '#F5F5F5',
    borderRadius: mvs(12),
    // elevation: 1,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: mvs(60),
    height: mvs(60),
    borderRadius: mvs(12),
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
    paddingHorizontal: mvs(4),
  },
  expandedCategoryItem: {
    width: '100%', // takes full row
    marginBottom: mvs(16),
    backgroundColor: '#eef6ff',
    borderRadius: mvs(12),
    padding: mvs(16),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },

  expandedContent: {
    marginTop: mvs(10),
  },
});

export default styles;
