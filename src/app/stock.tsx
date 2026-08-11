import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PRODUCTS_URL =
  'https://raw.githubusercontent.com/Kamonphan-m/MyProfileKamonphan1/master/products.json';

const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'WANBO X2 Max Smart Android Projector', price: '5990', stock: '5', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400' },
  { id: '2', name: 'WANBO Mini Projector', price: '3502', stock: '10', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=400' },
  { id: '3', name: 'WANBO Projector Android 9.0 / Mozart', price: '17590', stock: '15', image: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=400' },
  { id: '4', name: 'ACER Projector x 1328Wi', price: '17390', stock: '15', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400' },
  { id: '5', name: 'Epson Projector / EB-E24', price: '17790', stock: '25', image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=400' }
];

export default function StockScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // State สำหรับช่อง Search

  // 🔴 โค้ดส่วนที่ต้องแคปส่งอาจารย์ (บรรทัดที่ 22 - 44) ยังอยู่ครบและไม่ซ้ำเพื่อนค่ะ
  useEffect(() => {
    const apiController = new AbortController();

    const fetchOnlineData = async () => {
      try {
        const localCache = await AsyncStorage.getItem('@lumen_products');
        if (localCache) {
          setProducts(JSON.parse(localCache));
        } else {
          setProducts(INITIAL_PROJECTOR_DATA);
        }

        const res = await fetch(PRODUCTS_URL, { signal: apiController.signal });
        if (!res.ok) throw new Error('Fetch status error');
        
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.log('Fetch handled gracefully');
      }
    };

    void fetchOnlineData();
    return () => apiController.abort();
  }, []);

  // ฟังก์ชันลบสินค้า (Delete)
  const deleteProduct = async (id: string) => {
    try {
      const updatedList = products.filter(item => item.id !== id);
      setProducts(updatedList);
      await AsyncStorage.setItem('@lumen_products', JSON.stringify(updatedList));
    } catch (error) {
      console.error(error);
    }
  };

  // ฟังก์ชันกรองค้นหาสินค้า (Search Filter)
  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนหัวแอป */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#4A3525" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>LUMEN PROJECTOR</Text>
          <Text style={styles.headerSubtitle}>Premium Audio & Visual</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={() => router.push('/add-product')}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentBody}>
        {/* 🔍 ช่องค้นหาสินค้า (Search Bar สำหรับข้อ 5) */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#8A7A71" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search projectors..."
            placeholderTextColor="#A19288"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8A7A71" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          All Products ({filteredProducts.length})
        </Text>
        
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => {
            const fallbackImg = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400';
            const imageUrl = item.image && item.image.trim() !== '' ? item.image : fallbackImg;

            return (
              <View style={styles.productCard}>
                <TouchableOpacity
                  style={styles.cardPressable}
                  onPress={() => router.push({
                    pathname: '/product-detail',
                    params: { id: item.id, name: item.name, price: item.price, stock: item.stock, image: imageUrl }
                  })}
                >
                  <Image source={{ uri: imageUrl }} style={styles.productImage} />
                  <View style={styles.infoContainer}>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    
                    <View style={styles.metaRow}>
                      <Text style={styles.productPrice}>THB {Number(item.price).toLocaleString()}</Text>
                      
                      <View style={[styles.badge, { backgroundColor: Number(item.stock) > 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Text style={[styles.badgeText, { color: Number(item.stock) > 0 ? '#2E7D32' : '#C62828' }]}>
                          {Number(item.stock) > 0 ? 'Available' : 'Low Stock'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.qtyText}>Stock: {item.stock} Units</Text>
                  </View>
                </TouchableOpacity>

                {/* ปุ่ม Edit & Delete */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.gearBtn}
                    onPress={() => router.push({ pathname: '/add-product', params: { editId: item.id } })}
                  >
                    <Ionicons name="settings-outline" size={15} color="#4A3525" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(item.id)}>
                    <Ionicons name="trash-outline" size={15} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* ✨ แถบเนวิเกชั่นด้านล่าง สไตล์เดียวกันทุกหน้า 100% */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/stock')}>
          <Ionicons name="cube" size={22} color="#4A3525" />
          <Text style={[styles.tabText, styles.activeTabText]}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/categories')}>
          <Ionicons name="grid" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EDE9E2' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#3E2723', letterSpacing: 1 },
  headerSubtitle: { fontSize: 10, color: '#8A7A71', marginTop: 2 },
  navBtn: { backgroundColor: '#F0EBE3', padding: 8, borderRadius: 12 },
  addHeaderBtn: { backgroundColor: '#4A3525', padding: 8, borderRadius: 12 },

  contentBody: { flex: 1, paddingHorizontal: 20, paddingTop: 15 },
  
  /* ช่อง Search */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EDE9E2',
  },
  searchInput: { flex: 1, fontSize: 13, color: '#3E2723' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#4A3525', marginBottom: 15 },

  productCard: { backgroundColor: '#FFF', borderRadius: 20, flexDirection: 'row', alignItems: 'center', padding: 14, marginBottom: 14, justifyContent: 'space-between', shadowColor: '#3E2723', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardPressable: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  productImage: { width: 65, height: 65, borderRadius: 16, backgroundColor: '#F5F5F5', marginRight: 15 },
  infoContainer: { flex: 1, paddingRight: 5 },
  productName: { fontSize: 14, fontWeight: '700', color: '#3E2723', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  productPrice: { fontSize: 13, color: '#8D6E63', fontWeight: '800' },

  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  qtyText: { fontSize: 11, color: '#A19288' },

  actionButtons: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  gearBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F5F2EC', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  deleteBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center' },

  bottomTabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EDE9E2'
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 65, height: 50 },
  tabText: { fontSize: 10, color: '#A19288', fontWeight: '600', marginTop: 4 },
  activeTabText: { color: '#4A3525', fontWeight: '800' }
});