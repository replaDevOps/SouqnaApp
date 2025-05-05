import {StyleSheet} from 'react-native';
import {colors} from '../../../util/color';
import {mvs} from '../../../util/metrices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: mvs(12),
    paddingVertical: mvs(20),
  },
  title: {
    fontSize: mvs(24),
    fontWeight: 'bold',
  },
  emptyContainer: {
    // marginTop: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 24,
    backgroundColor: '#e5e5e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    marginTop: mvs(18),
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: mvs(10),
    paddingHorizontal: mvs(9),
    paddingVertical: mvs(10),
    flexDirection: 'row',
    marginVertical: 8,
  },
  itemImage: {
    width: mvs(70),
    height: mvs(70),
    borderRadius: mvs(10),
    marginRight: mvs(10),
  },
  itemContent: {
    paddingTop:mvs(7),
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: mvs(18),
    fontWeight: '600',
    paddingBottom: 4,
  },
  itemRestaurant: {
    fontSize: 16,
    color: '#999',
  },
  itemPrice: {
    fontSize: mvs(20),
    fontWeight: '500',
    color: '#064e3b',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  summaryContainer: {
    position: 'absolute',
    bottom: mvs(12),
    left: mvs(14),
    right: mvs(14),
    backgroundColor: colors.grey,
    borderRadius: mvs(16),
    zIndex: 10,
    overflow: 'hidden',
  },
  summaryBackground: {
    width: '100%',
    padding: mvs(15),
  },
  summaryContent: {
    gap: mvs(4),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(2),
  },
  summaryLabel: {
    color: '#e5e5e5',
    fontSize: mvs(15),
  },

  removeButtonText:{
    fontWeight:'800',
    color:colors.red1
  },
  removeButton:{
    flexDirection:'row',
    justifyContent:'flex-end',
    paddingRight:mvs(4)
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical:mvs(8),
  },
  totalLabel: {
    color: '#fff',
    fontSize: mvs(20),
    fontWeight: 'bold',
  },
  placeOrderButton: {
    paddingVertical: mvs(12),
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginTop: 10,
  },
  placeOrderText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#064e3b',
  },
});
export default styles;
