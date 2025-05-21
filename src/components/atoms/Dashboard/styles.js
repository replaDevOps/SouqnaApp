import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { mvs } from '../../../util/metrices';
import { colors } from '../../../util/color';

const styles = StyleSheet.create({
  container: {
    margin: mvs(15),
    backgroundColor:'#eee',
    padding: mvs(10),
    borderRadius:mvs(15)
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: colors.grey,
    paddingBottom: mvs(8),
    marginBottom: mvs(0),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: mvs(10),
    backgroundColor:'#fbfbfb',
    borderRadius:20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 15,
  },
  statLabel: {
    fontSize: mvs(12),
    color: colors.grey,
    textAlign: 'center',
    fontWeight: '500',
  },
  statValue: {
    fontSize: mvs(18),
    fontWeight: 'bold',
    marginTop: mvs(5),
    color: '#333',
  },
  chartSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
     backgroundColor:'#fbfbfb',
    borderRadius:20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 15,
    padding: mvs(10),
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendWrapper: {
    flex: 1,
    paddingLeft: mvs(15),
  },
  legendContainer: {
    flexDirection: 'column',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: mvs(4),
  },
  legendColor: {
    width: mvs(12),
    height: mvs(12),
    borderRadius: mvs(6),
    marginRight: mvs(8),
  },
  legendText: {
    fontSize: mvs(12),
    color: '#333',
    fontWeight: '500',
  },
  legendScrollView: {
    maxHeight: mvs(70),
  },
  scrollContent: {
    paddingRight: mvs(10),
  },
});

export default styles