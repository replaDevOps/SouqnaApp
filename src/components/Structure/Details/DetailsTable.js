import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { mvs } from '../../../util/metrices';

const CarDetailsCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // All details data
  const allDetails = [
    { label: 'Make', value: 'Toyota' },
    { label: 'Model', value: 'Corolla Altis' },
    { label: 'Condition', value: 'Used' },
    { label: 'Body Type', value: 'Sedan' },
    { label: 'Color', value: 'Blue' },
    { label: 'Number of seats', value: '5' },
    { label: 'Number of Owners', value: '1' },
    { label: 'Registration city', value: 'Islamabad' },
    { label: 'Car documents', value: 'Original' },
    { label: 'Assembly', value: 'Local' },
  ];

  const initialShowCount = 6;
  const visibleDetails = isExpanded ? allDetails : allDetails.slice(0, initialShowCount);
  const remainingCount = allDetails.length - initialShowCount;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const DetailRow = ({ label, value, isLast = false }) => (
    <View style={[styles.detailRow,  styles.borderBottom]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Details</Text>
      </View> */}
      
      <View style={styles.detailsContainer}>
        {visibleDetails.map((detail, index) => (
          <DetailRow
            key={index}
            label={detail.label}
            value={detail.value}
            isLast={index === visibleDetails.length - 1}
          />
        ))}
      </View>
      
      {remainingCount > 0 && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={toggleExpansion} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isExpanded ? 'View Less' : `View +${remainingCount} More`}
              <Text style={styles.arrow}> ⌄</Text>
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fafbfb',
    borderRadius: mvs(12),
    marginVertical: mvs(12),
    marginHorizontal: mvs(12),
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(17, 14, 14, 0.18)',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
//   detailsContainer: {
//     borderTopWidth: 1,
//     borderTopColor: '#000',
//   },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(17, 14, 14, 0.18)',
},
label: {
    fontSize: 16,
    paddingVertical: 8,
    paddingLeft: 16,
    backgroundColor:'#F2F4F5',
    color: '#6b7280',
    fontWeight: '400',
    flex: 0.5,
},
value: {
    paddingLeft: 16,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
textAlign:'left'
  },
  toggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    alignItems: 'center',
  },
  toggleButton: {
    width: '100%',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    color: '#3b82f6',
  },
});

export default CarDetailsCard;