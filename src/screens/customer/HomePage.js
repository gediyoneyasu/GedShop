import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { colors } from '../../styles/colors';

const { width } = Dimensions.get('window');

const HomePage = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(2);

  const banners = [
    { id: '1', image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?w=800', title: 'Super Sale!', subtitle: 'Up to 70% Off' },
    { id: '2', image: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?w=800', title: 'Brand Deals', subtitle: 'Up to 50% Off' },
    { id: '3', image: 'https://images.pexels.com/photos/4397842/pexels-photo-4397842.jpeg?w=800', title: 'Free Delivery', subtitle: 'On orders over ETB 1000' },
  ];

  const categories = [
    { id: '1', name: 'Electronics', icon: '📱', color: '#FF6B00' },
    { id: '2', name: 'Fashion', icon: '👕', color: '#E74C3C' },
    { id: '3', name: 'Home', icon: '🏠', color: '#2ECC71' },
    { id: '4', name: 'Beauty', icon: '💄', color: '#F39C12' },
    { id: '5', name: 'Sports', icon: '⚽', color: '#3498DB' },
    { id: '6', name: 'Toys', icon: '🎮', color: '#9B59B6' },
    { id: '7', name: 'Books', icon: '📚', color: '#1ABC9C' },
    { id: '8', name: 'More', icon: '✨', color: '#E67E22' },
  ];

  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeSlide + 1;
      if (nextIndex >= banners.length) nextIndex = 0;
      setActiveSlide(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerSlide} onPress={() => navigation.navigate('Products')}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
      <View style={styles.bannerOverlay}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        <View style={styles.bannerBtn}>
          <Text style={styles.bannerBtnText}>Shop Now →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={() => navigation.navigate('Products')}>
      <View style={[styles.categoryIconContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B00" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Slider */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={flatListRef}
          data={banners}
          renderItem={renderBanner}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveSlide(index);
          }}
        />
        <View style={styles.pagination}>
          {banners.map((_, i) => (
            <View key={i} style={[styles.paginationDot, activeSlide === i && styles.paginationDotActive]} />
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesGrid}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    margin: 12, 
    borderRadius: 25, 
    elevation: 3, 
    paddingHorizontal: 15 
  },
  searchIcon: { fontSize: 16, marginRight: 10, color: '#999' },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14 },
  searchBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  searchBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  bannerContainer: { height: 180 },
  bannerSlide: { width: width, height: 180 },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    padding: 12, 
    borderRadius: 10 
  },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  bannerSubtitle: { fontSize: 12, color: '#FFD700', marginTop: 4 },
  bannerBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, alignSelf: 'flex-start', marginTop: 8 },
  bannerBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  pagination: { flexDirection: 'row', justifyContent: 'center', position: 'absolute', bottom: 10, left: 0, right: 0 },
  paginationDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#888', marginHorizontal: 4 },
  paginationDotActive: { width: 16, backgroundColor: '#FF6B00' },
  
  section: { backgroundColor: '#FFF', marginTop: 8, paddingVertical: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  viewAll: { fontSize: 12, color: '#FF6B00' },
  
  categoriesGrid: { paddingHorizontal: 8 },
  categoryCard: { width: '25%', alignItems: 'center', marginBottom: 16 },
  categoryIconContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  categoryIcon: { fontSize: 24 },
  categoryName: { fontSize: 11, color: '#666', textAlign: 'center' },
});

export default HomePage;
