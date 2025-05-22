import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, {Path, G, Text as SvgText} from 'react-native-svg';
import styles from './styles';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';
import {useSelector} from 'react-redux';
import API from '../../../api/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDashboard = () => {
  const [activeView, setActiveView] = useState('total'); // 'total' or 'monthly'
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [categoryColorMap, setCategoryColorMap] = useState({});

  // Color palette for categories - we'll use this as our base palette
  const colorPalette = [
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
    '#003f5c',
    '#58508d',
    '#bc5090',
    '#ff6361',
    '#ffa600',
    '#488f31',
    '#de425b',
    '#0bb4ff',
    '#8bd3c7',
    '#7d8cc4',
    '#d3a294',
    '#a5bd78',
    '#c47dcc',
  ];

  const {token} = useSelector(state => state.user);

  // Load saved category color mappings
  const loadCategoryColors = async () => {
    try {
      const savedColors = await AsyncStorage.getItem('categoryColors');
      if (savedColors !== null) {
        setCategoryColorMap(JSON.parse(savedColors));
      }
    } catch (error) {
      console.error('Error loading category colors:', error);
    }
  };

  // Save category color mappings
  const saveCategoryColors = async colorMap => {
    try {
      await AsyncStorage.setItem('categoryColors', JSON.stringify(colorMap));
    } catch (error) {
      console.error('Error saving category colors:', error);
    }
  };

  // Assign colors to categories that don't have one yet
  const assignColorsToCategories = categories => {
    if (!categories) return [];

    // Create a new map to avoid mutating state directly
    const updatedColorMap = {...categoryColorMap};
    let hasNewCategories = false;

    // Assign colors to any new categories
    categories.forEach(category => {
      if (!updatedColorMap[category.name]) {
        // Find the first unused color in our palette
        const usedColors = Object.values(updatedColorMap);
        const availableColor = colorPalette.find(
          color => !usedColors.includes(color),
        );

        // If all colors are used, pick one randomly
        updatedColorMap[category.name] =
          availableColor ||
          colorPalette[Math.floor(Math.random() * colorPalette.length)];

        hasNewCategories = true;
      }
    });

    // Save updated color map if we assigned new colors
    if (hasNewCategories) {
      setCategoryColorMap(updatedColorMap);
      saveCategoryColors(updatedColorMap);
    }

    // Return categories with their colors
    return categories.map(category => ({
      name: category.name,
      count: category.count,
      color: updatedColorMap[category.name],
    }));
  };

  // Fetch dashboard data
  useEffect(() => {
    // Load saved colors first
    loadCategoryColors();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await API.get('seller-dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setDashboardData(response.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error(
          'Error fetching dashboard data:',
          error.response?.data || error.message,
        );
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  // Get active data based on selected view
  const getActiveCategories = () => {
    if (!dashboardData) return [];

    if (activeView === 'total') {
      return assignColorsToCategories(
        dashboardData.category_distribution.all_time,
      );
    } else {
      return assignColorsToCategories(
        dashboardData.category_distribution.this_month,
      );
    }
  };

  const activeCategories = getActiveCategories();
  const totalProducts = activeCategories.reduce(
    (sum, category) => sum + category.count,
    0,
  );

  const PieChart = () => {
    const radius = 80; // Increased size for better visibility
    const centerX = radius;
    const centerY = radius;

    // Handle the case where there's only one category
    if (activeCategories.length === 1) {
      return (
        <Svg
          height={radius * 2}
          width={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
          {/* Draw a complete circle for the single category */}
          <Path
            d={`M ${centerX} ${centerY} 
                m 0 -${radius} 
                a ${radius} ${radius} 0 1 1 0 ${radius * 2} 
                a ${radius} ${radius} 0 1 1 0 -${radius * 2}`}
            fill={activeCategories[0].color}
          />
          {/* Display percentage in the center */}
          <SvgText
            x={centerX}
            y={centerY}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            fill="white">
            100%
          </SvgText>
        </Svg>
      );
    }

    // Regular pie chart logic for multiple categories
    let startAngle = 0;

    return (
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        {activeCategories.map((category, index) => {
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
              {angle > 0.4 && (
                <SvgText
                  x={textX}
                  y={textY}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="white">
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
    // const visibleCategories = activeCategories.slice(0, 3); // First 3 categories
    // const remainingCategories = activeCategories.slice(3); // Remaining categories

    return (
      <ScrollView
        style={styles.legendScrollView}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        onStartShouldSetResponder={() => true}>
        <View>
          {activeCategories.map((category, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: category.color}]}
              />
              <Text style={styles.legendText}>
                {category.name} ({category.count})
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };


  return (
    <View style={styles.container}>
      {/* Stats Section as Buttons */}
      <View style={styles.statsContainer}>
        <View style={[styles.statBox,{marginRight:mvs(5)}]}>
          <Text style={styles.statLabel}>Total No. of Ads</Text>
          <Text style={styles.statValue}>480</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>No. of Ads This Month</Text>
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
