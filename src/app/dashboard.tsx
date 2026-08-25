import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import localProductsData from '../../products.json';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://119.59.102.161:3005/api';

const LOCAL_MOCK_PRODUCTS = [
  {
    id: "1",
    name: "WANBO X2 Max Smart Android Projector",
    price: 5990,
    stock: 15,
    location: "คลังสินค้าหลัก",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "WANBO Mini Projector",
    price: 3502,
    stock: 3,
    location: "คลังสินค้าหลัก",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "WANBO Projector Android 9.0 / Mozart",
    price: 17590,
    stock: 2,
    location: "คลังสินค้าหลัก",
    image: "https://images.unsplash.com/photo-1601944179066-297bff591b3e?w=500&auto=format&fit=crop"
  },
  {
    id: "4",
    name: "ACER ACER Projector x 1328wi",
    price: 17390,
    stock: 0,
    location: "คลังสินค้าหลัก",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: "5",
    name: "Epson EPSON Projector / EB-E24",
    price: 17790,
    stock: 4,
    location: "คลังสินค้าหลัก",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop"
  },
  {
    id: "6",
    name: "Xiaomi Mi Smart Projector 2 Pro",
    price: 23999,
    stock: 8,
    location: "คลังสินค้าหลัก",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop"
  }
];

export default function DashboardScreen() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-width * 0.75));

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('API Response Error');
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(localProductsData.length > 0 ? localProductsData : LOCAL_MOCK_PRODUCTS);
      }
    } catch (error) {
      setProducts(localProductsData.length > 0 ? localProductsData : LOCAL_MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleMenu = () => {
    Animated.timing(sidebarAnim, {
      toValue: isMenuOpen ? -width * 0.75 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const totalItems = products.length;
  const totalStockUnits = products.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
  const lowStockProducts = products.filter(item => (Number(item.stock) || 0) <= 5);
  const totalStockValue = products.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const stock = Number(item.stock) || 0;
    return sum + (price * stock);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar เมนูด้านข้าง */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarLogo}>
            LUMEN<Text style={styles.brandDot}>.OS</Text>
          </Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuBtn}>
            <Ionicons name="close" size={22} color="#42362B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sidebarMenu} showsVerticalScrollIndicator={false}>
          {[
            { label: 'Control Center', icon: 'home-outline', path: '/dashboard', active: true },
            { label: 'Insert Projector', icon: 'add-circle-outline', path: '/add-product' },
            { label: 'Warehouse Stock', icon: 'cube-outline', path: '/stock' },
            { label: 'Category Filter', icon: 'folder-open-outline', path: '/categories' },
            { label: 'Account Profile', icon: 'settings-outline', path: '/login' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sidebarItem, item.active && styles.sidebarItemActive]}
              onPress={() => {
                toggleMenu();
                router.push(item.path as any);
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={item.active ? '#FFF' : '#A09385'}
                style={styles.sidebarIcon}
              />
              <Text style={item.active ? styles.sidebarTextActive : styles.sidebarText}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            toggleMenu();
            router.push('/login');
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#D9534F" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Disconnect</Text>
        </TouchableOpacity>
      </Animated.View>

      {isMenuOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleMenu} />
      )}

      {/* Header ด้านบน */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
            <Ionicons name="menu-outline" size={22} color="#42362B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>DASHBOARD คลังโปรเจกเตอร์</Text>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
            <Text style={styles.avatarText}>AD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* 📌 การ์ดสรุปสถิติคลังสินค้า (โทนสีเหลืองไข่ พาสเทล) */}
        <Text style={styles.sectionTitle}>สรุปภาพรวมคลังสินค้า</Text>
        <View style={styles.statsGridContainer}>
          
          {/* เหลืองไข่แดงเข้ม (Warm Yolk) */}
          <View style={[styles.statBoxCard, { backgroundColor: '#EAA43A' }]}>
            <Ionicons name="cube-outline" size={20} color="#FFF8E7" />
            <Text style={[styles.statValueText, { color: '#FFFFFF' }]}>{totalItems}</Text>
            <Text style={[styles.statLabelText, { color: '#FFF3D6' }]}>รายการสินค้า</Text>
          </View>

          {/* เหลืองนวลพาสเทล (Soft Egg Yellow) */}
          <View style={[styles.statBoxCard, { backgroundColor: '#F2C94C' }]}>
            <Ionicons name="layers-outline" size={20} color="#5C4500" />
            <Text style={[styles.statValueText, { color: '#42362B' }]}>{totalStockUnits}</Text>
            <Text style={[styles.statLabelText, { color: '#5C4500' }]}>จำนวนสต็อก (เครื่อง)</Text>
          </View>

          {/* ส้มอิฐอบอุ่น สำหรับแจ้งเตือน (Warm Terracotta Coral) */}
          <View style={[styles.statBoxCard, { backgroundColor: '#E06A55' }]}>
            <Ionicons name="alert-circle-outline" size={20} color="#FFF0EE" />
            <Text style={[styles.statValueText, { color: '#FFFFFF' }]}>{lowStockProducts.length}</Text>
            <Text style={[styles.statLabelText, { color: '#FFE4E0' }]}>สต็อกใกล้หมด</Text>
          </View>

          {/* เหลืองทองมัสตาร์ดนุ่มนวล (Golden Mustard) */}
          <View style={[styles.statBoxCard, { backgroundColor: '#D4A24E' }]}>
            <Ionicons name="wallet-outline" size={20} color="#FFFBF0" />
            <Text style={[styles.statValueText, { color: '#FFFFFF' }]}>฿{totalStockValue.toLocaleString()}</Text>
            <Text style={[styles.statLabelText, { color: '#FFF5DC' }]}>มูลค่าสต็อกรวม</Text>
          </View>

        </View>

        {/* 📌 ส่วนแสดงสินค้าใกล้หมดสต็อก */}
        <Text style={styles.sectionTitle}>โปรเจกเตอร์ใกล้หมดสต็อก (เกณฑ์ ≤ 5 เครื่อง)</Text>
        <View style={styles.lowStockBox}>
          {loading ? (
            <ActivityIndicator size="small" color="#EAA43A" />
          ) : lowStockProducts.length > 0 ? (
            lowStockProducts.map((item, index) => (
              <View key={item.id || index} style={styles.lowStockRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lowStockName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.lowStockSubText}>{item.location || 'คลังสินค้าหลัก'}</Text>
                </View>
                <View style={styles.badgeWarn}>
                  <Text style={styles.badgeWarnText}>{item.stock ?? 0} เครื่อง</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>ไม่มีโปรเจกเตอร์ที่สต็อกใกล้หมด</Text>
          )}
        </View>

        {/* 📌 รายการโปรเจกเตอร์ทั้งหมดในระบบ */}
        <Text style={styles.sectionTitle}>รายการโปรเจกเตอร์ทั้งหมด (LIVE API DATA)</Text>
        <View style={styles.productListContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#EAA43A" />
          ) : products.length > 0 ? (
            products.map((item, index) => (
              <View key={item.id || index} style={styles.productCard}>
                <Image
                  source={{
                    uri: item.image || item.image_url || 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400'
                  }}
                  style={styles.productImage}
                  resizeMode="contain"
                />

                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    ฿{Number(item.price || 0).toLocaleString()} • สต็อก: {item.stock ?? 0} เครื่อง
                  </Text>
                </View>

                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>ID: {item.id}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>ไม่พบข้อมูลโปรเจกเตอร์</Text>
          )}
        </View>

      </ScrollView>

      {/* แถบเนวิเกชั่นลอยด้านล่าง */}
      <View style={styles.bottomTabBarWrapper}>
        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
            <Ionicons name="home" size={22} color="#EAA43A" />
            <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/add-product')}>
            <Ionicons name="add-circle-outline" size={22} color="#A09385" />
            <Text style={styles.tabText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/stock')}>
            <Ionicons name="cube-outline" size={22} color="#A09385" />
            <Text style={styles.tabText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/categories')}>
            <Ionicons name="grid-outline" size={22} color="#A09385" />
            <Text style={styles.tabText}>Categories</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF9EE' }, // พื้นหลังโทนสีเปลือกไข่นุ่มๆ
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EED9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  headerTitle: { fontSize: 14, fontWeight: '800', color: '#42362B', letterSpacing: 1 },
  menuTrigger: { backgroundColor: '#FAF4DF', padding: 8, borderRadius: 12 },
  avatar: {
    backgroundColor: '#EAA43A',
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 11 },
  
  scrollContainer: {
    padding: 20,
    paddingBottom: 140,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8C7E72',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  // 📊 สไตล์สำหรับการ์ดสถิติ 4 ช่อง (Egg Yellow Themes)
  statsGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statBoxCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
    minHeight: 100,
    elevation: 3,
    shadowColor: '#7A6230',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statValueText: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  statLabelText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ⚠️ ป้ายเตือนในธีมส้ม-เหลืองพาสเทล
  lowStockBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F3EED9',
  },
  lowStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF6E6',
  },
  lowStockName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#42362B',
  },
  lowStockSubText: {
    fontSize: 10,
    color: '#A09385',
    marginTop: 2,
  },
  badgeWarn: {
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD8B5',
  },
  badgeWarnText: {
    color: '#E06A55',
    fontSize: 11,
    fontWeight: '800',
  },

  // 📦 รายการสินค้า
  productListContainer: { marginTop: 4 },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3EED9',
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#FFF',
  },
  productName: { fontSize: 13, fontWeight: '700', color: '#42362B' },
  productPrice: { fontSize: 11, color: '#998675', marginTop: 3, fontWeight: '600' },
  
  idBadge: {
    backgroundColor: '#FAF4DF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  idBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C7E72',
  },

  noDataText: { textAlign: 'center', color: '#A09385', marginVertical: 14, fontSize: 12 },

  // 📌 Floating TabBar
  bottomTabBarWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  bottomTabBar: {
    width: '90%',
    maxWidth: 860,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#5C4827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F3EED9',
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 65, height: 50 },
  tabText: { fontSize: 10, color: '#A09385', fontWeight: '600', marginTop: 4 },
  activeTabText: { color: '#EAA43A', fontWeight: '800' },
  
  // 🚪 Sidebar Styles
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '75%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    padding: 24,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF4DF',
  },
  sidebarLogo: { fontSize: 16, fontWeight: '900', color: '#42362B', letterSpacing: 2 },
  brandDot: { color: '#EAA43A' },
  closeMenuBtn: { backgroundColor: '#FAF4DF', padding: 6, borderRadius: 10 },
  sidebarMenu: { marginTop: 24 },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  sidebarItemActive: { backgroundColor: '#EAA43A' },
  sidebarIcon: { marginRight: 14 },
  sidebarText: { color: '#8C7E72', fontSize: 14, fontWeight: '600' },
  sidebarTextActive: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EE',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE4E0',
  },
  logoutText: { color: '#D9534F', fontSize: 13, fontWeight: '700' },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(66, 54, 43, 0.35)',
    zIndex: 90,
  },
});