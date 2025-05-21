import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import styles from './styles';
import { mvs } from '../../../util/metrices';

const ProductDashboard = () => {
  const productCategories = [
    { name: 'Electronics', count: 120, color: '#2f4b7c' },
    { name: 'Clothing', count: 95, color: '#665191' },
    { name: 'Sports', count: 60, color: '#d45087' },
    { name: 'Home & Garden', count: 80, color: '#a05195' },
    { name: 'Furniture', count: 45, color: '#f95d6a' },
    { name: 'Other', count: 80, color: '#ff7c43' },
];

  const totalProducts = productCategories.reduce((sum, category) => sum + category.count, 0);

  const PieChart = () => {
    const radius = 80; // Increased size for better visibility
    const centerX = radius;
    const centerY = radius;

    let startAngle = 0;

    return (
      <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        {productCategories.map((category, index) => {
          const percentage = category.count / totalProducts;
          const angle = percentage * 2 * Math.PI;
          const endAngle = startAngle + angle;

          const x1 = centerX + radius * Math.sin(startAngle);
          const y1 = centerY - radius * Math.cos(startAngle);
          const x2 = centerX + radius * Math.sin(endAngle);
          const y2 = centerY - radius * Math.cos(endAngle);

          const largeArcFlag = angle > Math.PI ? 1 : 0;

          const path = `
            M ${centerX} ${centerY}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z
          `;

          const midAngle = startAngle + angle / 2;
          const textRadius = radius * 0.65;
          const textX = centerX + textRadius * Math.sin(midAngle);
          const textY = centerY - textRadius * Math.cos(midAngle);

          startAngle = endAngle;

          return (
            <G key={index}>
              <Path d={path} fill={category.color} />
              {angle > 0.4 && ( // Only show percentage for larger segments to avoid clutter
                <SvgText
                  x={textX}
                  y={textY}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="white"
                >
                  {Math.round(percentage * 100)}%
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    );
  };

  const CategoryLegend = () => {
    const visibleCategories = productCategories.slice(0, 3); // First 3 categories
    const remainingCategories = productCategories.slice(3); // Remaining categories

    return (
      <View style={styles.legendContainer}>
        {visibleCategories.map((category, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: category.color }]} />
            <Text style={styles.legendText}>
              {category.name} ({category.count})
            </Text>
          </View>
        ))}
        {remainingCategories.length > 0 && (
          <ScrollView
            style={styles.legendScrollView}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            {remainingCategories.map((category, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: category.color }]} />
                <Text style={styles.legendText}>
                  {category.name} ({category.count})
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox,{marginRight:mvs(5)}]}>
          <Text style={styles.statLabel}>Total No. of Products</Text>
          <Text style={styles.statValue}>480</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>No. of Products This Month</Text>
          <Text style={styles.statValue}>22</Text>
        </View>
      </View>

      {/* Chart and Legend Section */}
      <View style={styles.chartSection}>
        <View style={styles.chartContainer}>
          <PieChart />
        </View>
        <View style={styles.legendWrapper}>
          <CategoryLegend />
        </View>
      </View>
    </View>
  );
};



export default ProductDashboard;