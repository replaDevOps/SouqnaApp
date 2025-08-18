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
import {useSelector} from 'react-redux';
import API from '../../../api/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import CustomText from '../../CustomText';

const ProductDashboard = ({onRefresh}) => {
  const [activeView, setActiveView] = useState('total'); // 'total' or 'monthly'
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [categoryColorMap, setCategoryColorMap] = useState({});
  const {t} = useTranslation();
  const colorPalette = [
    '#003f5c', // Dark Teal
    '#58508d', // Slate Purple
    '#bc5090', // Plum Pink
    '#ff6361', // Coral Red
    '#ffa600', // Amber Yellow
  ];
  const {token} = useSelector(state => state.user);

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

  const saveCategoryColors = async colorMap => {
    try {
      await AsyncStorage.setItem('categoryColors', JSON.stringify(colorMap));
    } catch (error) {
      console.error('Error saving category colors:', error);
    }
  };

  const assignColorsToCategories = categories => {
    if (!categories) return [];

    const updatedColorMap = {...categoryColorMap};
    let hasNewCategories = false;

    const usedColors = new Set(Object.values(updatedColorMap));
    const availableColors = colorPalette.filter(
      color => !usedColors.has(color),
    );
    let colorIndex = 0;

    categories.forEach(category => {
      if (!updatedColorMap[category.name]) {
        let assignedColor =
          availableColors.length > 0
            ? availableColors.shift()
            : colorPalette[colorIndex % colorPalette.length];
        updatedColorMap[category.name] = assignedColor;
        usedColors.add(assignedColor);
        hasNewCategories = true;
        colorIndex++;
      }
    });

    if (hasNewCategories) {
      setCategoryColorMap(updatedColorMap);
      saveCategoryColors(updatedColorMap);
    }

    return categories.map(category => ({
      name: category.name,
      count: category.count,
      color: updatedColorMap[category.name],
    }));
  };

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

  useEffect(() => {
    loadCategoryColors();
    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    onRefresh?.(() => {
      fetchDashboardData();
    });
  }, []);

  const getActiveCategories = () => {
    if (!dashboardData) return [];

    console.log('dashboard data:', dashboardData);

    return assignColorsToCategories(
      activeView === 'total'
        ? dashboardData.category_distribution.all_time
        : dashboardData.category_distribution.this_month,
    );
  };

  const activeCategories = getActiveCategories();
  const totalProducts = activeCategories.reduce(
    (sum, category) => sum + category.count,
    0,
  );

  const PieChart = () => {
    const radius = 80;
    const centerX = radius;
    const centerY = radius;

    if (activeCategories.length === 1) {
      return (
        <Svg
          height={radius * 2}
          width={radius * 2}
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
          <Path
            d={`M ${centerX} ${centerY}
                m 0 -${radius}
                a ${radius} ${radius} 0 1 1 0 ${radius * 2}
                a ${radius} ${radius} 0 1 1 0 -${radius * 2}`}
            fill={activeCategories[0].color}
          />
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
              <CustomText style={styles.legendText}>
                {t(category.name)} ({category.count})
              </CustomText>
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
        {/* <Loader width={mvs(250)} height={mvs(250)} /> */}
        {/* <ActivityIndicator size="large" color={'#008e91'} />} */}
        <ActivityIndicator size="large" color={'#008e91'} />
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
        <CustomText style={{color: 'red'}}>{error}</CustomText>
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
        <CustomText>{t('noDataAvailable')}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
          <CustomText
            style={[
              styles.statLabel,
              activeView === 'total' && {color: '#000'},
            ]}>
            {t('totalProducts')}
          </CustomText>
          <CustomText style={[styles.statValue]}>
            {dashboardData.total_ads}
          </CustomText>
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
          <CustomText
            style={[
              styles.statLabel,
              activeView === 'monthly' && {color: '#000'},
            ]}>
            {t('productsThisMonth')}
          </CustomText>
          <CustomText
            style={[
              styles.statValue,
              activeView === 'monthly' && {color: '#000'},
            ]}>
            {dashboardData.ads_this_month}
          </CustomText>
        </TouchableOpacity>
      </View>

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
