import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../../util/color';

const styles = StyleSheet.create({
  container: {},
  scrollContent: {
    // flex: 1,
    // marginTop: 30,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: 'rgba(179, 176, 176, 0.09)',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    // elevation: 3,
    flex: 1,
    minWidth: '45%',
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 15,
  },
  details: {
    fontSize: 14,
    marginBottom: 5,
  },
  target: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.lightgreen,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default styles;
