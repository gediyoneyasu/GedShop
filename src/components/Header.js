import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { colors } from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const GedShopHeader = ({ language, setLanguage, currentPage, onNavigate, cartCount = 0 }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || 'Guest');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const selectLanguage = async (lang) => {
    if (setLanguage) {
      setLanguage(lang);
      await AsyncStorage.setItem('appLanguage', lang);
    }
    setShowLangDropdown(false);
  };

  const translations = {
    en: {
      home: 'Home', products: 'Products', categories: 'Categories', 
      cart: 'Cart', orders: 'Orders', profile: 'Profile', about: 'About',
      welcome: 'Welcome to GedShop', subtitle: 'Your one-stop shop',
      hello: 'Hello', guest: 'Guest'
    },
    am: {
      home: 'መነሻ', products: 'ምርቶች', categories: 'ምድቦች',
      cart: 'ጋሪ', orders: 'ትዕዛዞች', profile: 'መገለጫ', about: 'ስለእኛ',
      welcome: 'እንኳን ወደ ጌድሾፕ በደህና መጡ', subtitle: 'አንድ ቦታ ሁሉም ግብዓቶች',
      hello: 'ሰላም', guest: 'እንግዳ'
    }
  };

  const t = translations[language] || translations.en;
  const pageTitles = {
    en: { home: 'Home', products: 'Products', categories: 'Categories', cart: 'Shopping Cart', orders: 'My Orders', profile: 'My Profile', about: 'About Us' },
    am: { home: 'መነሻ', products: 'ምርቶች', categories: 'ምድቦች', cart: 'የግዢ ጋሪ', orders: 'የእኔ ትዕዛዞች', profile: 'የእኔ መገለጫ', about: 'ስለእኛ' }
  };

  const pageTitle = (pageTitles[language] && pageTitles[language][currentPage]) || pageTitles.en.home;

  const menuItems = [
    { id: 'home', name: t.home, icon: '🏠' },
    { id: 'products', name: t.products, icon: '🛍️' },
    { id: 'categories', name: t.categories, icon: '📁' },
    { id: 'cart', name: t.cart, icon: '🛒' },
    { id: 'orders', name: t.orders, icon: '📦' },
    { id: 'profile', name: t.profile, icon: '👤' },
    { id: 'about', name: t.about, icon: 'ℹ️' },
  ];

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} translucent={false} />
      <View style={[styles.headerContainer, { paddingTop: Platform.OS === 'android' ? statusBarHeight : 0 }]}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.logoContainer} onPress={() => onNavigate && onNavigate('home')}>
            <View style={styles.logoCircle}><Text style={styles.logoEmoji}>🛍️</Text></View>
            <View><Text style={styles.logoText}>Ged<Text style={styles.logoHighlight}>Shop</Text></Text><Text style={styles.logoSubtitle}>E-commerce Store</Text></View>
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.cartBtn} onPress={() => onNavigate && onNavigate('cart')}>
              <Text style={styles.cartIcon}>🛒</Text>
              {cartCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cartCount}</Text></View>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.langBtn} onPress={() => setShowLangDropdown(true)}>
              <Text style={styles.langBtnText}>{language === 'en' ? 'EN' : 'አማ'}</Text>
              <Text style={styles.langArrow}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setShowMenu(true)}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.pageTitleRow}>
          <View><Text style={styles.pageTitle}>{pageTitle}</Text><Text style={styles.pageSubtitle}>{t.welcome}</Text></View>
          <View style={styles.userGreeting}><Text style={styles.greetingText}>{t.hello},</Text><Text style={styles.userNameText}>{userName === 'Guest' ? t.guest : userName}</Text></View>
        </View>
      </View>

      {/* Language Modal */}
      <Modal visible={showLangDropdown} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowLangDropdown(false)}>
          <View style={styles.langModal}>
            <TouchableOpacity style={[styles.langOption, language === 'en' && styles.langOptionActive]} onPress={() => selectLanguage('en')}>
              <Text style={styles.langOptionText}>English (EN)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langOption, language === 'am' && styles.langOptionActive]} onPress={() => selectLanguage('am')}>
              <Text style={styles.langOptionText}>አማርኛ (AM)</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Menu Modal */}
      <Modal visible={showMenu} transparent={true} animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={[styles.menuModal, { top: Platform.OS === 'android' ? statusBarHeight + 110 : 110 }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.menuItem, currentPage === item.id && styles.activeMenuItem]} onPress={() => { onNavigate && onNavigate(item.id); setShowMenu(false); }}>
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={[styles.menuItemText, currentPage === item.id && styles.activeMenuItemText]}>{item.name}</Text>
                  {currentPage === item.id && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.versionFooter}><Text style={styles.versionText}>GedShop v1.0.0</Text></View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: colors.primary, paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: colors.secondary },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' },
  logoEmoji: { fontSize: 22 }, logoText: { fontSize: 18, fontWeight: '700', color: colors.textWhite }, logoHighlight: { color: colors.secondary }, logoSubtitle: { fontSize: 8, color: colors.secondary, marginTop: 1 },
  rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cartBtn: { position: 'relative', width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cartIcon: { fontSize: 16, color: colors.textWhite },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: colors.error, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { color: colors.textWhite, fontSize: 10, fontWeight: 'bold' },
  langBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: colors.secondary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4, height: 34 },
  langBtnText: { color: colors.textWhite, fontSize: 11, fontWeight: '500' }, langArrow: { color: colors.secondary, fontSize: 8 },
  menuBtn: { width: 36, height: 36, backgroundColor: colors.secondary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, menuIcon: { fontSize: 18, color: colors.primary, fontWeight: 'bold' },
  pageTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textWhite }, pageSubtitle: { fontSize: 11, color: colors.secondary, marginTop: 2 },
  userGreeting: { alignItems: 'flex-end' }, greetingText: { fontSize: 11, color: colors.secondary }, userNameText: { fontSize: 14, fontWeight: 'bold', color: colors.textWhite },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  langModal: { position: 'absolute', top: 100, right: 70, backgroundColor: colors.surface, borderRadius: 12, minWidth: 140, overflow: 'hidden', elevation: 5 },
  langOption: { paddingVertical: 10, paddingHorizontal: 16 }, langOptionActive: { backgroundColor: colors.primary + '20' }, langOptionText: { color: colors.text, fontSize: 13 },
  menuModal: { position: 'absolute', left: 0, width: '100%', height: height - 110, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden', paddingTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24, gap: 18, position: 'relative' },
  activeMenuItem: { backgroundColor: colors.primary + '10' }, menuItemIcon: { fontSize: 22, width: 36, color: colors.text }, menuItemText: { fontSize: 16, color: colors.text, fontWeight: '500' },
  activeMenuItemText: { color: colors.primary, fontWeight: 'bold' }, activeIndicator: { position: 'absolute', right: 0, width: 4, height: 32, backgroundColor: colors.primary, borderRadius: 2 },
  versionFooter: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, marginTop: 16 }, versionText: { fontSize: 11, color: colors.textLight },
});

export default GedShopHeader;
