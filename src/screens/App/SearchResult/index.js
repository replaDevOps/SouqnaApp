import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import SearchHeader from '../../../components/Headers/SearchHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import {mvs} from '../../../util/metrices';
import {colors} from '../../../util/color';
import {SafeAreaView} from 'react-native-safe-area-context';
import MainHeader from '../../../components/Headers/MainHeader';
import Bold from '../../../typography/BoldText';
import {useSelector} from 'react-redux';
import {
  fetchBuyerProducts,
  fetchSellerProducts,
} from '../../../api/apiServices';
import ProductCard from '../../../components/Cards/ProductCard';

const SearchResultsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const initialSearchText = route.params?.searchText || '';
  const [searchText, setSearchText] = useState(initialSearchText);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const {token, role} = useSelector(state => state.user);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts(searchText);
  }, [searchText]);
  const filters = {
    productName: '',
    fromDate: '',
    toDate: '',
    status: '',
  };
  const loadProducts = async () => {
    try {
      setLoading(true);

      // const response = await fetchBuyerProducts(token, {}, role);
      const response =
        role === 2 || role === '2'
          ? await fetchSellerProducts(token, filters)
          : await fetchBuyerProducts(filters);
      console.log('API product response:', response);

      // Adjusting the response to access products inside the 'data' field
      if (response?.success && Array.isArray(response.data)) {
        setAllProducts(response.data); // All products
        setFilteredProducts(response.data); // Filtered products
      } else {
        console.warn('No products received or invalid format:', response);
        setAllProducts([]); // Ensure an empty array if no products
        setFilteredProducts([]); // Ensure an empty array if no products
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = query => {
    if (!query) {
      setFilteredProducts(allProducts);
      return;
    }
    const filtered = allProducts.filter(product =>
      product.name?.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  const handleSearch = query => {
    console.log('Searching for:', query);
    // Perform search logic here
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../../assets/img/empty.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Bold style={styles.emptyText}>
        {searchText ? t('noMatchingProducts') : t('startSearching')}
      </Bold>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <MainHeader title={t('search')} onClose={handleClose} showBackIcon />
      <SearchHeader
        onFocusSearch={() => {}}
        isSearchMode={true}
        onSearch={handleSearch}
        showLocationIcon={false}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.id?.toString()}
          renderItem={({item}) => <ProductCard product={item} />}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{paddingBottom: 50, padding: 10}}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: mvs(10),
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(10),
  },
  backButton: {
    marginRight: mvs(10),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.lightGray,
    borderRadius: mvs(50),
    paddingHorizontal: mvs(10),
  },
  searchBar: {
    flex: 1,
    height: mvs(40),
    fontSize: mvs(16),
    marginLeft: mvs(10),
    color: colors.grey,
  },
  clearButton: {
    marginLeft: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: colors.grey,
    fontSize: mvs(18),
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: mvs(20),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: mvs(50),
  },
  emptyImage: {
    width: mvs(150),
    height: mvs(150),
    marginBottom: mvs(20),
  },
  emptyText: {
    fontSize: mvs(16),
    color: colors.black,
  },
});

export default SearchResultsScreen;
