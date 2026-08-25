import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'WANBO X2 Max Smart Android Projector', price: '5990', stock: '5', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400' },
  { id: '2', name: 'WANBO Mini Projector', price: '3502', stock: '10', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=400' },
  { id: '3', name: 'WANBO Projector Android 9.0 / Mozart', price: '17590', stock: '15', image: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=400' },
  { id: '4', name: 'ACER ACER Projector x 1328wi', price: '17390', stock: '15', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400' },
  { id: '5', name: 'Epson EPSON Projector / EB-E24', price: '17790', stock: '25', image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=400' },
  { id: '6', name: 'Xiaomi Mi Smart Projector 2 Pro', price: '21900', stock: '4', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const localCache = await AsyncStorage.getItem('@lumen_products');
      if (localCache) {
        setProducts(JSON.parse(localCache));
      } else {
        setProducts(INITIAL_PROJECTOR_DATA);
        await AsyncStorage.setItem('@lumen_products', JSON.stringify(INITIAL_PROJECTOR_DATA));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [])
  );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) <= 5);
  const lowStockCount = lowStockProducts.length;
  const totalValue = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons name="menu-outline" size={22} color="#4A3525" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>DASHBOARD คลังโปรเจกเตอร์</Text>
          </View>

          <View style={styles.headerRightGroup}>
            <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/stock')}>
              <Ionicons name="cart-outline" size={20} color="#4A3525" />
            </TouchableOpacity>

            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>AD</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentBody} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <Text style={styles.sectionTitle}>สรุปภาพรวมคลังสินค้า</Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#E59B37' }]}>
            <Ionicons name="cube-outline" size={26} color="#FFF" />
            <Text style={styles.statValue}>{totalProducts}</Text>
            <Text style={styles.statLabel}>รายการสินค้า</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F3CA40' }]}>
            <Ionicons name="layers-outline" size={26} color="#FFF" />
            <Text style={styles.statValue}>{totalStock}</Text>
            <Text style={styles.statLabel}>จำนวนสต็อก (เครื่อง)</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E06B55' }]}>
            <Ionicons name="alert-circle-outline" size={26} color="#FFF" />
            <Text style={styles.statValue}>{lowStockCount}</Text>
            <Text style={styles.statLabel}>สต็อกใกล้หมด</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#D4A359' }]}>
            <Ionicons name="wallet-outline" size={26} color="#FFF" />
            <Text style={styles.statValue}>฿{totalValue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>มูลค่าสต็อกรวม</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>โปรเจกเตอร์ใกล้หมดสต็อก (เกณฑ์ ≤ 5 เครื่อง)</Text>

        <View style={styles.lowStockContainer}>
          {lowStockProducts.length === 0 ? (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>ไม่มีสินค้ารายการใดต่ำกว่า 5 เครื่อง</Text>
            </View>
          ) : (
            lowStockProducts.map((item, index) => (
              <View key={item.id || String(index)} style={[styles.lowStockRow, index === lowStockProducts.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productSub}>คลังสินค้าหลัก</Text>
                </View>

                <View style={styles.badgeQty}>
                  <Text style={styles.badgeQtyText}>+ {item.stock} เครื่อง</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Tab Bar */}
      <View style={styles.bottomTabBarWrapper}>
        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
            <Ionicons name="home" size={22} color="#D97706" />
            <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/add-product')}>
            <Ionicons name="add-circle-outline" size={22} color="#8A7A71" />
            <Text style={styles.tabText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/stock')}>
            <Ionicons name="cube-outline" size={22} color="#8A7A71" />
            <Text style={styles.tabText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/categories')}>
            <Ionicons name="grid-outline" size={22} color="#8A7A71" />
            <Text style={styles.tabText}>Categories</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  header: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EDE9E2' },
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
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#3E2723', letterSpacing: 0.5 },
  navBtn: { backgroundColor: '#F0EBE3', padding: 8, borderRadius: 12 },
  headerRightGroup: { flexDirection: 'row', alignItems: 'center' },
  cartBtn: { backgroundColor: '#F0EBE3', padding: 8, borderRadius: 12, marginRight: 8 },
  avatarCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E59B37', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  contentBody: { flex: 1, paddingHorizontal: 20, paddingTop: 18, maxWidth: 900, width: '100%', alignSelf: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#5C4638', marginBottom: 12 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48.5%', borderRadius: 18, padding: 16, marginBottom: 12, minHeight: 110, justifyContent: 'space-between', elevation: 2 },
  statValue: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 6 },
  statLabel: { fontSize: 12, fontWeight: '600', color: 'rgba(255, 255, 255, 0.92)' },

  lowStockContainer: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#EDE9E2', overflow: 'hidden' },
  lowStockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F2EC' },
  productName: { fontSize: 13, fontWeight: '700', color: '#3E2723' },
  productSub: { fontSize: 11, color: '#A19288', marginTop: 2 },
  badgeQty: { backgroundColor: '#FDF0ED', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#F8D7DA' },
  badgeQtyText: { fontSize: 11, fontWeight: '700', color: '#E06B55' },
  emptyView: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#A19288', fontSize: 13 },

  bottomTabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 25 : 15, paddingTop: 10, backgroundColor: 'rgba(247, 244, 240, 0.92)' },
  bottomTabBar: { width: '90%', maxWidth: 860, backgroundColor: '#FFFFFF', borderRadius: 24, height: 65, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#EDE9E2', elevation: 8 },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 65, height: 50 },
  tabText: { fontSize: 10, color: '#A19288', fontWeight: '600', marginTop: 4 },
  activeTabText: { color: '#D97706', fontWeight: '800' },
});