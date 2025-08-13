/* eslint-disable no-catch-shadow */
import {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomText from '../../../components/CustomText';
import MainHeader from '../../../components/Headers/MainHeader';
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';
import {showSnackbar} from '../../../redux/slices/snackbarSlice';
import {
  GetSellerDetails,
  GetSellerProducts,
  addToFavorite,
  removeFromFavorite,
  BASE_URL,
} from '../../../api/apiServices';
import {ProductCard} from './components';
import SkeletonView from '../../../components/SkeletonView';

const useDebounced = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Badge = ({text, type}) => (
  <View style={[styles.badge, styles[`badge${type}`]]}>
    <CustomText style={[styles.badgeText, styles[`badgeText${type}`]]}>
      {text}
    </CustomText>
  </View>
);

const StatItem = ({label, value, isLoading}) => (
  <View style={styles.statItem}>
    {isLoading ? (
      <SkeletonView width={60} height={20} />
    ) : (
      <CustomText style={styles.statValue}>{value}</CustomText>
    )}
    <CustomText style={styles.statLabel}>{label}</CustomText>
  </View>
);

export const SellerProfile = ({route}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const {token, role} = useSelector(state => state.user);

  const debouncedSearchText = useDebounced(searchText, 300);

  const sellerId =
    route?.params?.sellerId || '08e967bf-9146-44a5-8838-75618460c651';

  const isLoggedIn = Boolean(token);

  const handleHeartClick = useCallback(
    async (id, item) => {
      if (role === 2 || role === '2') {
        dispatch(showSnackbar('Log in as buyer'));
        return;
      }

      if (!token) {
        dispatch(showSnackbar('Please log in to add favorites'));
        return;
      }

      try {
        const isInFavorites = item?.isFavorite;

        if (isInFavorites) {
          await removeFromFavorite(id, token).then(res => {
            const updatedAllProducts = allProducts.map(product => {
              if (product.id === id) {
                product.isFavorite = !product.isFavorite;
              }
              return product;
            });

            const updatedFilteredProducts = filteredProducts.map(product => {
              if (product.id === id) {
                product.isFavorite = !product.isFavorite;
              }
              return product;
            });

            setAllProducts(updatedAllProducts);
            setFilteredProducts(updatedFilteredProducts);
            dispatch(showSnackbar('Removed from favorites'));
          });
        } else {
          await addToFavorite(id, token).then(res => {
            const updatedAllProducts = allProducts.map(product => {
              if (product.id === id) {
                product.isFavorite = !product.isFavorite;
              }
              return product;
            });

            const updatedFilteredProducts = filteredProducts.map(product => {
              if (product.id === id) {
                product.isFavorite = !product.isFavorite;
              }
              return product;
            });

            setAllProducts(updatedAllProducts);
            setFilteredProducts(updatedFilteredProducts);
            dispatch(showSnackbar('Added to favorites'));
          });
        }
      } catch (error) {
        console.error('Error updating favorite:', error);
        dispatch(showSnackbar('Failed to update favorite'));
      }
    },
    [role, token, filteredProducts, allProducts, dispatch],
  );

  const searchProducts = async searchQuery => {
    if (!searchQuery.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    try {
      setIsSearching(true);

      const searchResponse = await GetSellerProducts(
        sellerId,
        {productName: searchQuery},
        isLoggedIn,
        token,
      );

      if (searchResponse && searchResponse.success) {
        setFilteredProducts(searchResponse.data || []);
      } else {
        const localFiltered = allProducts.filter(product => {
          const productName =
            i18n.language === 'ar' && product.ar_name
              ? product.ar_name.toLowerCase()
              : product.name.toLowerCase();
          const categoryName = product.category
            ? i18n.language === 'ar' && product.category.ar_name
              ? product.category.ar_name.toLowerCase()
              : product.category.name.toLowerCase()
            : '';
          const location =
            i18n.language === 'ar' && product.ar_location
              ? product.ar_location.toLowerCase()
              : product.location.toLowerCase();

          return (
            productName.includes(searchQuery.toLowerCase()) ||
            categoryName.includes(searchQuery.toLowerCase()) ||
            location.includes(searchQuery.toLowerCase())
          );
        });
        setFilteredProducts(localFiltered);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      const localFiltered = allProducts.filter(product => {
        const productName =
          i18n.language === 'ar' && product.ar_name
            ? product.ar_name.toLowerCase()
            : product.name.toLowerCase();
        return productName.includes(searchQuery.toLowerCase());
      });
      setFilteredProducts(localFiltered);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    searchProducts(debouncedSearchText);
  }, [debouncedSearchText, allProducts]);

  // Main data fetching function
  const fetchSellerData = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      setError(null);

      const [sellerDetailsResponse, sellerProductsResponse] = await Promise.all(
        [
          GetSellerDetails(sellerId, token),
          GetSellerProducts(sellerId, {}, isLoggedIn, token),
        ],
      );

      if (!sellerDetailsResponse || !sellerDetailsResponse.success) {
        throw new Error('Failed to fetch seller details');
      }

      if (!sellerProductsResponse || !sellerProductsResponse.success) {
        throw new Error('Failed to fetch seller products');
      }

      const sellerDetails = sellerDetailsResponse.data;
      const sellerProducts = sellerProductsResponse.data || [];

      const processedSellerData = {
        id: sellerDetails.id,
        name: sellerDetails.name,
        email: sellerDetails.email,
        phone: sellerDetails.document?.phoneNo || 'N/A',
        address: sellerDetails.document?.address || 'N/A',
        country: sellerDetails.document?.country || 'N/A',
        fullName: sellerDetails.document?.fullName || sellerDetails.name,
        gender: sellerDetails.document?.gender || 'N/A',
        dob: sellerDetails.document?.dob || 'N/A',
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          sellerDetails.name,
        )}&background=20B2AA&color=fff&size=120`,
        dateJoined: sellerDetails.created_at,
        sellerType:
          parseInt(sellerDetails.sellerType, 10) ||
          (parseInt(sellerDetails.role, 10) === 4 ? 1 : 0),
        status: sellerDetails.status,
        role: sellerDetails.role,
        fcm: sellerDetails.fcm,
        updated_at: sellerDetails.updated_at,
        // Document verification status
        documentStatus: sellerDetails.document?.status || 0,
        documentType: sellerDetails.document?.documentType || 'N/A',
        idNumber: sellerDetails.document?.idNumber || 'N/A',
        totalListings: sellerProducts.length,
        activeListings: sellerProducts.filter(product => product.status === 0)
          .length,
      };

      setSellerData(processedSellerData);
      setAllProducts(sellerProducts);
      setFilteredProducts(sellerProducts);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setError(error.message);
      Alert.alert(t('error'), t('failedToLoadData') || 'Failed to load data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchSellerData();
    }
  }, [sellerId]);

  const onRefresh = () => {
    fetchSellerData(true);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const getSellerTypeBadges = sellerType => {
    if (sellerType === 1) {
      return ['COMPANY', 'VERIFIED'];
    } else {
      return ['INDIVIDUAL', 'TRUSTED'];
    }
  };

  // const getDocumentStatusBadge = documentStatus => {
  //   switch (documentStatus) {
  //     case 0:
  //       return {text: t('pending') || 'Pending', type: 'Warning'};
  //     case 1:
  //       return {text: t('underReview') || 'Under Review', type: 'Info'};
  //     case 2:
  //       return {text: t('verified') || 'Verified', type: 'Success'};
  //     case 3:
  //       return {text: t('rejected') || 'Rejected', type: 'Danger'};
  //     default:
  //       return {text: t('unknown') || 'Unknown', type: 'Secondary'};
  //   }
  // };

  const getBadgeText = badge => {
    const badgeTranslations = {
      COMPANY: t('company') || 'Company',
      INDIVIDUAL: t('individual') || 'Individual',
      VERIFIED: t('verified') || 'Verified',
      TRUSTED: t('trusted') || 'Trusted',
      TOP_SATISFACTION: t('topSatisfaction') || 'Top Satisfaction',
    };
    return badgeTranslations[badge] || badge;
  };

  const getBadgeType = badge => {
    const badgeTypes = {
      COMPANY: 'Primary',
      INDIVIDUAL: 'Secondary',
      VERIFIED: 'Success',
      TRUSTED: 'Success',
      TOP_SATISFACTION: 'Primary',
      Warning: 'Warning',
      Info: 'Info',
      Danger: 'Danger',
    };
    return badgeTypes[badge] || 'Primary';
  };

  const formatJoinDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  // const formatAge = dob => {
  //   if (!dob || dob === 'N/A') return 'N/A';
  //   const birthDate = new Date(dob);
  //   const today = new Date();
  //   const age = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();

  //   if (
  //     monthDiff < 0 ||
  //     (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //   ) {
  //     return age - 1;
  //   }
  //   return age;
  // };

  const handleCall = () => {
    if (sellerData?.phone && sellerData.phone !== 'N/A') {
      Linking.openURL(`tel:${sellerData.phone}`);
    } else {
      Alert.alert(
        t('error') || 'Error',
        t('phoneNotAvailable') || 'Phone number not available',
      );
    }
  };

  const handleEmail = () => {
    if (sellerData?.email) {
      Linking.openURL(`mailto:${sellerData.email}`);
    } else {
      Alert.alert(
        t('error') || 'Error',
        t('emailNotAvailable') || 'Email not available',
      );
    }
  };

  if (error && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#20B2AA" />
        <MainHeader
          title={t('sellerProfile') || 'Seller Profile'}
          showBackIcon={true}
          backgroundColor="#20B2AA"
          textColor="#fff"
        />
        <View style={styles.errorContainer}>
          <CustomText style={styles.errorText}>
            {t('errorLoadingProfile') || 'Error loading profile'}
          </CustomText>
          <CustomText style={styles.errorDetails}>{error}</CustomText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchSellerData()}>
            <CustomText style={styles.retryButtonText}>
              {t('retry') || 'Retry'}
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#20B2AA" />
      <MainHeader
        title={
          isLoading
            ? t('loading') || 'Loading'
            : sellerData?.name || t('sellerProfile') || 'Seller Profile'
        }
        showBackIcon={true}
        backgroundColor="#20B2AA"
        textColor="#fff"
      />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#20B2AA"
          />
        }>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            {isLoading ? (
              <>
                <SkeletonView
                  width={100}
                  height={100}
                  style={styles.avatarSkeleton}
                />
                <View style={styles.profileTextInfo}>
                  <SkeletonView width={120} height={24} />
                  <SkeletonView
                    width={180}
                    height={16}
                    style={{marginTop: 8}}
                  />
                  <SkeletonView
                    width={100}
                    height={16}
                    style={{marginTop: 4}}
                  />
                  <SkeletonView width={80} height={16} style={{marginTop: 4}} />
                </View>
              </>
            ) : (
              <>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri: sellerData.image,
                    }}
                    style={styles.avatar}
                  />
                  {sellerData.status === 1 && (
                    <View style={styles.verifiedBadge}>
                      <CustomText style={styles.verifiedText}>✓</CustomText>
                    </View>
                  )}
                </View>

                <View style={styles.profileTextInfo}>
                  <CustomText style={styles.sellerName}>
                    {sellerData.fullName || sellerData.name}
                  </CustomText>
                  <CustomText style={styles.sellerType}>
                    👤{' '}
                    {sellerData.sellerType === 1
                      ? t('company') || 'Company'
                      : t('individual') || 'Individual'}
                  </CustomText>
                  <CustomText style={styles.activeSince}>
                    📅 {t('activeSince') || 'Active since'}{' '}
                    {formatJoinDate(sellerData.dateJoined)}
                  </CustomText>
                  <CustomText style={styles.location}>
                    🌍 {sellerData.address}, {sellerData.country}
                  </CustomText>
                  {/* {sellerData.gender !== 'N/A' && (
                    <CustomText style={styles.personalInfo}>
                      👥 {sellerData.gender} • {formatAge(sellerData.dob)}{' '}
                      {t('yearsOld') || 'years old'}
                    </CustomText>
                  )}
                  {sellerData.idNumber !== 'N/A' && (
                    <CustomText style={styles.idInfo}>
                      🆔 {sellerData.documentType}: {sellerData.idNumber}
                    </CustomText>
                  )} */}
                </View>
              </>
            )}
          </View>

          <View style={styles.badgesContainer}>
            {isLoading ? (
              <View style={styles.badgeRow}>
                <SkeletonView
                  width={130}
                  height={28}
                  style={styles.badgeSkeleton}
                />
                <SkeletonView
                  width={100}
                  height={28}
                  style={styles.badgeSkeleton}
                />
              </View>
            ) : (
              <View style={styles.badgeRow}>
                {getSellerTypeBadges(sellerData.sellerType).map(
                  (badge, index) => (
                    <Badge
                      key={index}
                      text={getBadgeText(badge)}
                      type={getBadgeType(badge)}
                    />
                  ),
                )}
                {/* Document Status Badge */}
                {/* {sellerData.documentStatus !== undefined && (
                  <Badge
                    text={
                      getDocumentStatusBadge(sellerData.documentStatus).text
                    }
                    type={
                      getDocumentStatusBadge(sellerData.documentStatus).type
                    }
                  />
                )} */}
              </View>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatItem
            label={t('totalListings') || 'Total Listings'}
            value={isLoading ? '...' : sellerData?.totalListings || 0}
            isLoading={isLoading}
          />
          <StatItem
            label={t('activeListings') || 'Active Listings'}
            value={isLoading ? '...' : sellerData?.activeListings || 0}
            isLoading={isLoading}
          />
          {/* <StatItem
            label={t('searchResults') || 'Search Results'}
            value={isLoading ? '...' : filteredProducts.length}
            isLoading={isLoading}
          /> */}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.websiteButton} onPress={handleEmail}>
            <CustomText style={styles.websiteButtonText}>
              ✉️ {t('email') || 'Email'}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <CustomText style={styles.callButtonText}>
              📞 {t('call') || 'Call'}
            </CustomText>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        {/* <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <CustomText style={[styles.tabText, styles.activeTabText]}>
              {t('listings') || 'Listings'}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <CustomText style={styles.tabText}>
              {t('about') || 'About'}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <CustomText style={styles.tabText}>
              {t('contact') || 'Contact'}
            </CustomText>
          </TouchableOpacity>
        </View> */}

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <CustomText style={styles.searchIcon}>🔍</CustomText>
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchInListings') || 'Search in listings'}
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}>
                <CustomText style={styles.clearText}>✕</CustomText>
              </TouchableOpacity>
            )}
            {isSearching && (
              <ActivityIndicator
                size="small"
                color="#20B2AA"
                style={styles.searchLoader}
              />
            )}
          </View>
        </View>

        <View style={styles.productsContainer}>
          {isLoading ? (
            Array.from({length: 4}).map((_, index) => (
              <ProductCard
                key={index}
                product={null}
                isLoading={true}
                baseImageUrl={BASE_URL}
                onHeartClick={handleHeartClick}
                userRole={role}
                isLoggedIn={isLoggedIn}
              />
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || index}
                product={product}
                isLoading={false}
                baseImageUrl={BASE_URL}
                onHeartClick={handleHeartClick}
                userRole={role}
                isLoggedIn={isLoggedIn}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <CustomText style={styles.emptyStateText}>
                {searchText
                  ? t('noMatchingProducts') || 'No matching products found'
                  : t('noListingsFound') || 'No listings found'}
              </CustomText>
              {searchText && (
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={clearSearch}>
                  <CustomText style={styles.clearSearchText}>
                    {t('clearSearch') || 'Clear Search'}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
  },
  avatarSkeleton: {
    borderRadius: 50,
    marginRight: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileTextInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  sellerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sellerType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  activeSince: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  personalInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  idInfo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badgesContainer: {
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  badgePrimary: {
    backgroundColor: '#20B2AA',
  },
  badgeSecondary: {
    backgroundColor: '#6B7280',
  },
  badgeSuccess: {
    backgroundColor: '#10B981',
  },
  badgeWarning: {
    backgroundColor: '#F59E0B',
  },
  badgeInfo: {
    backgroundColor: '#3B82F6',
  },
  badgeDanger: {
    backgroundColor: '#EF4444',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextPrimary: {
    color: '#FFFFFF',
  },
  badgeTextSecondary: {
    color: '#FFFFFF',
  },
  badgeTextSuccess: {
    color: '#FFFFFF',
  },
  badgeTextWarning: {
    color: '#FFFFFF',
  },
  badgeTextInfo: {
    color: '#FFFFFF',
  },
  badgeTextDanger: {
    color: '#FFFFFF',
  },
  badgeSkeleton: {
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  websiteButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  websiteButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#20B2AA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#20B2AA',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#20B2AA',
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#6B7280',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  searchLoader: {
    marginLeft: 8,
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  negotiableBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  negotiableText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productLocation: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  productDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  productCategory: {
    fontSize: 12,
    color: '#20B2AA',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: '#20B2AA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearSearchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetails: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#20B2AA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellerProfile;
