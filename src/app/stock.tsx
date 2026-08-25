import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🛒 Cart States
  const [cart, setCart] = useState<any[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  useEffect(() => {
    const apiController = new AbortController();

    const fetchOnlineData = async () => {
      try {
        // ดึงข้อมูลสินค้า
        const localCache = await AsyncStorage.getItem('@lumen_products');
        if (localCache) {
          setProducts(JSON.parse(localCache));
        } else {
          setProducts(INITIAL_PROJECTOR_DATA);
        }

        // ดึงข้อมูลตระกร้าสินค้าเดิม
        const localCart = await AsyncStorage.getItem('@lumen_cart');
        if (localCart) {
          setCart(JSON.parse(localCart));
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

  // บันทึก ตระกร้าลง AsyncStorage
  const saveCart = async (newCart: any[]) => {
    setCart(newCart);
    await AsyncStorage.setItem('@lumen_cart', JSON.stringify(newCart));
  };

  // 🛒 ฟังก์ชันเพิ่มสินค้าลงตระกร้า
  const addToCart = (product: any) => {
    const maxStock = Number(product.stock);
    if (maxStock <= 0) {
      Alert.alert('สินค้าหมด', 'ขออภัย สินค้านี้หมดสต็อกแล้ว');
      return;
    }

    const existingIndex = cart.findIndex((item) => item.id === product.id);
    let updatedCart = [...cart];

    if (existingIndex > -1) {
      if (updatedCart[existingIndex].quantity >= maxStock) {
        Alert.alert('จำกัดจำนวน', `คุณใส่สินค้านี้ในตระกร้าครบตามสต็อกที่มีแล้ว (${maxStock} ชิ้น)`);
        return;
      }
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    saveCart(updatedCart);
  };

  // 🛒 ปรับจำนวนสินค้าในตระกร้า (+/-)
  const updateCartQuantity = (id: string, delta: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          const maxStock = Number(item.stock);
          if (newQty > maxStock) {
            Alert.alert('จำกัดจำนวน', `สินค้าในสต็อกมีเพียง ${maxStock} ชิ้น`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  // 🛒 ระบบชำระเงิน ตัดสต็อกจริง
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // คำนวณสต็อกใหม่
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((c) => c.id === prod.id);
      if (cartItem) {
        const remainingStock = Math.max(0, Number(prod.stock) - cartItem.quantity);
        return { ...prod, stock: String(remainingStock) };
      }
      return prod;
    });

    setProducts(updatedProducts);
    await AsyncStorage.setItem('@lumen_products', JSON.stringify(updatedProducts));
    
    // ล้างตระกร้า
    saveCart([]);
    setIsCartVisible(false);

    Alert.alert('สำเร็จ! 🎉', 'ทำการสั่งซื้อสินค้าเรียบร้อยแล้ว');
  };

  const deleteProduct = async (id: string) => {
    try {
      const updatedList = products.filter(item => item.id !== id);
      setProducts(updatedList);
      await AsyncStorage.setItem('@lumen_products', JSON.stringify(updatedList));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนหัวแอป */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={22} color="#4A3525" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>LUMEN PROJECTOR</Text>
            <Text style={styles.headerSubtitle}>Premium Audio & Visual</Text>
          </View>
          
          {/* ปุ่มตระกร้าสินค้า + Badge แจ้งเตือนจำนวน */}
          <TouchableOpacity style={styles.cartHeaderBtn} onPress={() => setIsCartVisible(true)}>
            <Ionicons name="cart-outline" size={22} color="#4A3525" />
            {totalCartItems > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{totalCartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentBody}>
        {/* ช่อง Search */}
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
        
        {/* FlatList ปรับแต่งการ์ดขนาดสมส่วน */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
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
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                  </View>
                  
                  <View style={styles.detailsContainer}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productPrice}>THB {Number(item.price).toLocaleString()}</Text>
                    
                    <View style={styles.metaRow}>
                      <View style={[styles.badge, { backgroundColor: Number(item.stock) > 0 ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Text style={[styles.badgeText, { color: Number(item.stock) > 0 ? '#2E7D32' : '#C62828' }]}>
                          {Number(item.stock) > 0 ? 'Available' : 'Out of Stock'}
                        </Text>
                      </View>
                      <Text style={styles.qtyText}>Stock: {item.stock}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* แถบปุ่มจัดการสินค้า + ปุ่มใส่ตระกร้า */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => addToCart(item)}
                  >
                    <Ionicons name="cart" size={15} color="#FFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.gearBtn}
                    onPress={() => router.push({ pathname: '/add-product', params: { editId: item.id } })}
                  >
                    <Ionicons name="settings-outline" size={14} color="#4A3525" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(item.id)}>
                    <Ionicons name="trash-outline" size={14} color="#D32F2F" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* 🛒 Modal ตระกร้าสินค้า (Shopping Cart Modal) */}
      <Modal visible={isCartVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.cartContainer}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}> Shopping Cart ({totalCartItems})</Text>
              <TouchableOpacity onPress={() => setIsCartVisible(false)}>
                <Ionicons name="close" size={24} color="#4A3525" />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCartView}>
                <Ionicons name="cart-outline" size={60} color="#D0C4B8" />
                <Text style={styles.emptyCartText}>ไม่มีสินค้าในตระกร้า</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.cartItemRow}>
                      <Image source={{ uri: item.image }} style={styles.cartItemImg} />
                      <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cartItemPrice}>THB {Number(item.price).toLocaleString()}</Text>
                      </View>

                      {/* เพิ่ม / ลด จำนวน */}
                      <View style={styles.qtyControls}>
                        <TouchableOpacity onPress={() => updateCartQuantity(item.id, -1)} style={styles.qtyBtn}>
                          <Ionicons name="remove" size={14} color="#4A3525" />
                        </TouchableOpacity>
                        <Text style={styles.cartQtyText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateCartQuantity(item.id, 1)} style={styles.qtyBtn}>
                          <Ionicons name="add" size={14} color="#4A3525" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                />

                {/* ส่วนสรุปราคารวม & ปุ่มชำระเงิน */}
                <View style={styles.cartFooter}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>ราคารวมทั้งสิ้น:</Text>
                    <Text style={styles.totalAmount}>THB {totalCartPrice.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                    <Text style={styles.checkoutBtnText}>ดำเนินการชำระเงิน</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* แถบเนวิเกชั่นด้านล่าง */}
      <View style={styles.bottomTabBarWrapper}>
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
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#3E2723', letterSpacing: 1 },
  headerSubtitle: { fontSize: 10, color: '#8A7A71', marginTop: 2 },
  navBtn: { backgroundColor: '#F0EBE3', padding: 8, borderRadius: 12 },
  
  cartHeaderBtn: { backgroundColor: '#F0EBE3', padding: 8, borderRadius: 12, position: 'relative' },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCountText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  contentBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  
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

  columnWrapper: { justifyContent: 'space-between' },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    width: '48.5%',
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justify: 'space-between',
    borderWidth: 1,
    borderColor: '#EDE9E2',
  },
  cardPressable: { width: '100%' },
  
  imageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  
  detailsContainer: { paddingHorizontal: 2 },
  productName: { fontSize: 13, fontWeight: '700', color: '#3E2723', marginBottom: 4, height: 34, lineHeight: 17 },
  productPrice: { fontSize: 14, color: '#8D6E63', fontWeight: '800', marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },

  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  qtyText: { fontSize: 10, color: '#A19288', fontWeight: '500' },

  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F5F2EC',
    paddingTop: 8,
    marginTop: 4,
  },
  addToCartBtn: { flex: 2, height: 32, borderRadius: 8, backgroundColor: '#4A3525', justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  gearBtn: { flex: 1, height: 32, borderRadius: 8, backgroundColor: '#F5F2EC', justifyContent: 'center', alignItems: 'center', marginRight: 4 },
  deleteBtn: { flex: 1, height: 32, borderRadius: 8, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center' },

  /* 🛒 Modal UI Styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  cartContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottomWidth: 1, borderColor: '#EDE9E2' },
  cartTitle: { fontSize: 16, fontWeight: 'bold', color: '#4A3525' },
  emptyCartView: { padding: 40, alignItems: 'center' },
  emptyCartText: { marginTop: 10, color: '#8A7A71', fontSize: 14 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F5F2EC' },
  cartItemImg: { width: 50, height: 50, borderRadius: 8, resizeMode: 'contain' },
  cartItemName: { fontSize: 13, fontWeight: '700', color: '#3E2723' },
  cartItemPrice: { fontSize: 12, color: '#8D6E63', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F4F0', borderRadius: 8, padding: 4 },
  qtyBtn: { padding: 4 },
  cartQtyText: { marginHorizontal: 8, fontSize: 12, fontWeight: 'bold' },
  cartFooter: { borderTopWidth: 1, borderColor: '#EDE9E2', paddingTop: 15, marginTop: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 14, color: '#8A7A71' },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: '#4A3525' },
  checkoutBtn: { backgroundColor: '#4A3525', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  bottomTabBarWrapper: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomTabBar: {
    width: '90%',
    maxWidth: 860,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 70,
    flexDirection: 'row',
    justify: 'space-around',
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EDE9E2',
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 65, height: 50 },
  tabText: { fontSize: 10, color: '#A19288', fontWeight: '600', marginTop: 4 },
  activeTabText: { color: '#4A3525', fontWeight: '800' }
});