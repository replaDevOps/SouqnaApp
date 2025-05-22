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
    '#2F4B7C',
    '#665191',
    '#A05195',
    '#D45087',
    '#F95D6A',
    '#FF7C43',
    '#FFA600',
    '#003F5C',
    '#58508D',
    '#BC5090',
    '#FF6361',
    '#FFA600',
    '#488F31',
    '#DE425B',
    '#0BB4FF',
    '#8BD3C7',
    '#7D8CC4',
    '#D3A294',
    '#A5BD78',
    '#C47DCC',
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

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text style={{color: 'red'}}>{error}</Text>
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Section as Buttons */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={[
            styles.statBox,
            {marginRight: mvs(10)},
            activeView === 'total' && {
              backgroundColor: 'rgba(196, 218, 106, 0.14)',
              borderWidth: 1,
            },
          ]}
          onPress={() => setActiveView('total')}>
          <Text
            style={[
              styles.statLabel,
              activeView === 'total' && {color: '#000'},
            ]}>
            Total No. of Products
          </Text>
          <Text style={[styles.statValue]}>{dashboardData.total_ads}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.statBox,
            activeView === 'monthly' && {
              backgroundColor: 'rgba(196, 218, 106, 0.14)',
              borderWidth: 1,
            },
          ]}
          onPress={() => setActiveView('monthly')}>
          <Text
            style={[
              styles.statLabel,
              activeView === 'monthly' && {color: '#000'},
            ]}>
            No. of Products This Month
          </Text>
          <Text
            style={[
              styles.statValue,
              activeView === 'monthly' && {color: '#000'},
            ]}>
            {dashboardData.ads_this_month}
          </Text>
        </TouchableOpacity>
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
