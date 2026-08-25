import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://119.59.102.161:3005/api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

const LOCAL_MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Wando WANO X2 Max Smart Android Projector",
    price: 5990,
    stock: 15,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "Wando WANDO Mini Projector",
    price: 3502,
    stock: 10,
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "Wando WANDO Projector Mozart",
    price: 17590,
    stock: 2,
    image: "https://images.unsplash.com/photo-1601944179066-297bff591b3e?w=500&auto=format&fit=crop"
  },
  {
    id: "4",
    name: "ACER Projector x 1328wi",
    price: 17390,
    stock: 15,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500&auto=format&fit=crop"
  }
];

export default function StockScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 🛒 State ตะกร้าสินค้า
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(LOCAL_MOCK_PRODUCTS);
      }
    } catch {
      setProducts(LOCAL_MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🛒 จัดการตะกร้าสินค้า
  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      Alert.alert('สินค้าหมด', 'สินค้ารายการนี้หมดสต็อกแล้ว');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        if (currentQty >= product.stock) {
          Alert.alert('แจ้งเตือน', `คุณเพิ่มครบตามจำนวนสต็อกที่มีอยู่แล้ว (${product.stock} เครื่อง)`);
          return prevCart;
        }
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            image: product.image || product.image_url || 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400',
            quantity: 1,
            stock: Number(product.stock) || 0,
          },
        ];
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > item.stock) {
              Alert.alert('แจ้งเตือน', `สินค้ามีในสต็อกทั้งหมด ${item.stock} เครื่อง`);
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    Alert.alert(
      'ยืนยันการสั่งซื้อ',
      `ราคารวมทั้งสิ้น ฿${cartTotalAmount.toLocaleString()}\nยืนยันการสั่งซื้อหรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ยืนยันสั่งซื้อ',
          onPress: () => {
            setProducts((prev) =>
              prev.map((prod) => {
                const itemInCart = cart.find((c) => c.id === prod.id);
                if (itemInCart) {
                  return { ...prod, stock: prod.stock - itemInCart.quantity };
                }
                return prod;
              })
            );
            setCart([]);
            setIsCartOpen(false);
            Alert.alert('สั่งซื้อสำเร็จ! 🎉', 'ระบบทำการบันทึกรายการเรียบร้อยแล้ว');
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#42362B" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>LUMEN PROJECTOR</Text>
          <Text style={styles.headerSubTitle}>Premium Audio & Visual</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity style={styles.cartHeaderBtn} onPress={() => setIsCartOpen(true)}>
            <Ionicons name="cart-outline" size={20} color="#42362B" />
            {cartTotalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartTotalItems}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.addHeaderBtn} onPress={() => router.push('/add-product')}>
            <Ionicons name="add" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#A09385" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search projectors..."
            placeholderTextColor="#A09385"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>All Products ({filteredProducts.length})</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#EAA43A" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((item, index) => (
              <View key={item.id || index} style={styles.card}>
                <Image
                  source={{ uri: item.image || item.image_url || 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400' }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />

                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                
                <Text style={styles.cardPrice}>
                  THB {Number(item.price || 0).toLocaleString()}
                </Text>

                <View style={styles.stockRow}>
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableBadgeText}>
                      {item.stock > 0 ? 'Available' : 'Out of Stock'}
                    </Text>
                  </View>
                  <Text style={styles.stockText}>Stock: {item.stock ?? 0}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.addToCartBtn, item.stock <= 0 && styles.disabledBtn]}
                  onPress={() => addToCart(item)}
                  disabled={item.stock <= 0}
                >
                  <Ionicons name="cart" size={15} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.addToCartText}>
                    {item.stock > 0 ? 'ใส่ตะกร้า' : 'สินค้าหมด'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 🛒 Modal ตะกร้าสินค้า */}
      <Modal
        visible={isCartOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCartOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="cart" size={22} color="#EAA43A" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>ตะกร้าสินค้า ({cartTotalItems})</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCartOpen(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={20} color="#42362B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartRow}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="contain" />
                    
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                      <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>฿{(item.price * item.quantity).toLocaleString()}</Text>
                    </View>

                    <View style={styles.quantityContainer}>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.qtyBtn}>
                        <Ionicons name="remove" size={14} color="#42362B" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.qtyBtn}>
                        <Ionicons name="add" size={14} color="#42362B" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={18} color="#D9534F" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyCartContainer}>
                  <Ionicons name="basket-outline" size={48} color="#D4C8B5" />
                  <Text style={styles.emptyCartText}>ยังไม่มีสินค้าในตะกร้า</Text>
                </View>
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>ราคารวมทั้งหมด:</Text>
                  <Text style={styles.totalValue}>฿{cartTotalAmount.toLocaleString()}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.checkoutBtnText}>สั่งซื้อสินค้า</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* TabBar ด้านล่าง */}
      <View style={styles.bottomTabBarWrapper}>
        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
            <Ionicons name="home-outline" size={22} color="#A09385" />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/add-product')}>
            <Ionicons name="add-circle-outline" size={22} color="#A09385" />
            <Text style={styles.tabText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/stock')}>
            <Ionicons name="cube" size={22} color="#EAA43A" />
            <Text style={[styles.tabText, styles.activeTabText]}>Products</Text>
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
  container: { flex: 1, backgroundColor: '#FCF9EE' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3EED9',
  },
  iconBtn: { backgroundColor: '#FAF4DF', padding: 8, borderRadius: 12 },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#42362B', letterSpacing: 1 },
  headerSubTitle: { fontSize: 10, color: '#998675', fontWeight: '600' },
  cartHeaderBtn: { backgroundColor: '#FAF4DF', padding: 8, borderRadius: 12, position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E06A55',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  addHeaderBtn: { backgroundColor: '#42362B', padding: 8, borderRadius: 12 },

  scrollContainer: { padding: 16, paddingBottom: 120 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F3EED9',
  },
  searchInput: { flex: 1, fontSize: 13, color: '#42362B' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#42362B', marginTop: 18, marginBottom: 12 },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3EED9',
  },
  cardImage: { width: '100%', height: 110, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontSize: 12, fontWeight: '700', color: '#42362B', height: 32 },
  cardPrice: { fontSize: 13, fontWeight: '900', color: '#EAA43A', marginTop: 4 },
  
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 10 },
  availableBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  availableBadgeText: { color: '#2E7D32', fontSize: 9, fontWeight: '800' },
  stockText: { fontSize: 10, color: '#998675', fontWeight: '600' },

  addToCartBtn: {
    backgroundColor: '#EAA43A',
    borderRadius: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: { backgroundColor: '#D4C8B5' },
  addToCartText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(66, 54, 43, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#FAF4DF' },
  modalTitle: { fontSize: 15, fontWeight: '800', color: '#42362B' },
  closeModalBtn: { backgroundColor: '#FAF4DF', padding: 6, borderRadius: 10 },
  cartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#FAF6E6' },
  cartItemImage: { width: 40, height: 40, borderRadius: 8 },
  cartItemName: { fontSize: 12, fontWeight: '700', color: '#42362B' },
  cartItemPrice: { fontSize: 11, color: '#EAA43A', fontWeight: '800', marginTop: 2 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF4DF', borderRadius: 8, paddingHorizontal: 4, paddingVertical: 2, marginRight: 8 },
  qtyBtn: { padding: 4 },
  qtyText: { fontSize: 12, fontWeight: '800', color: '#42362B', paddingHorizontal: 8 },
  deleteBtn: { padding: 6 },
  emptyCartContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyCartText: { marginTop: 8, color: '#A09385', fontSize: 13, fontWeight: '600' },
  cartFooter: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#FAF4DF', marginTop: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#8C7E72' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#EAA43A' },
  checkoutBtn: { backgroundColor: '#EAA43A', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

  bottomTabBarWrapper: { position: 'absolute', bottom: 25, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  bottomTabBar: { width: '90%', maxWidth: 860, backgroundColor: '#FFFFFF', borderRadius: 24, height: 70, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', shadowColor: '#5C4827', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8, borderWidth: 1, borderColor: '#F3EED9' },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 65, height: 50 },
  tabText: { fontSize: 10, color: '#A09385', fontWeight: '600', marginTop: 4 },
  activeTabText: { color: '#EAA43A', fontWeight: '800' },
});