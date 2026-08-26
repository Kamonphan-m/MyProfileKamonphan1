import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
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
    stock: 5,
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

  // 🛒 State สำหรับระบบตะกร้าสินค้า
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🛠️ ฟังก์ชันแปลงข้อมูลสินค้าให้เป็น Format เดียวกัน (รองรับกรณี DB ใช้ชื่อ field ไม่ตรงกัน)
  const formatProductsData = (rawData: any[]) => {
    return rawData.map((item) => ({
      ...item,
      // ดึงค่าสต็อก แม้ว่าใน API/DB จะใช้ชื่อ stock, stock_quantity, quantity หรือ qty
      stock: Number(
        item.stock ?? 
        item.stock_quantity ?? 
        item.quantity ?? 
        item.qty ?? 
        0
      ),
      price: Number(item.price ?? 0),
    }));
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('API Response Error');
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(formatProductsData(data));
      } else {
        const fallback = localProductsData.length > 0 ? localProductsData : LOCAL_MOCK_PRODUCTS;
        setProducts(formatProductsData(fallback));
      }
    } catch (error) {
      const fallback = localProductsData.length > 0 ? localProductsData : LOCAL_MOCK_PRODUCTS;
      setProducts(formatProductsData(fallback));
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

  // 🛒 ฟังก์ชันจัดการตะกร้าสินค้า
  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      Alert.alert('สินค้าหมด', 'ขออภัย สินค้ารายการนี้หมดสต็อกแล้ว');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        if (currentQty >= product.stock) {
          Alert.alert('แจ้งเตือน', `สามารถเพิ่มได้สูงสุด ${product.stock} เครื่องตามจำนวนที่มีในสต็อก`);
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
      `รวมยอดชำระทั้งสิ้น ฿${cartTotalAmount.toLocaleString()}\nต้องการยืนยันคำสั่งซื้อหรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'สั่งซื้อเลย',
          onPress: () => {
            // ตัดสต็อกในหน้าจอชั่วคราว
            setProducts((prevProducts) =>
              prevProducts.map((prod) => {
                const cartItem = cart.find((item) => item.id === prod.id);
                if (cartItem) {
                  return { ...prod, stock: prod.stock - cartItem.quantity };
                }
                return prod;
              })
            );
            setCart([]);
            setIsCartOpen(false);
            Alert.alert('สั่งซื้อสำเร็จ! 🎉', 'ระบบได้บันทึกคำสั่งซื้อของคุณเรียบร้อยแล้ว');
          },
        },
      ]
    );
  };

  // 📊 คำนวณยอด
  const totalItems = products.length;
  const totalStockUnits = products.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
  const lowStockProducts = products.filter(item => (Number(item.stock) || 0) <= 5);
  const totalStockValue = products.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const stock = Number(item.stock) || 0;
    return sum + (price * stock);
  }, 0);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

      {/* Header ด้านบน พร้อมไอคอนตะกร้าสินค้า */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
            <Ionicons name="menu-outline" size={22} color="#42362B" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>DASHBOARD </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* 🛒 ปุ่มตะกร้าสินค้าพร้อม Badge */}
            <TouchableOpacity style={styles.cartHeaderBtn} onPress={() => setIsCartOpen(true)}>
              <Ionicons name="cart-outline" size={22} color="#42362B" />
              {cartTotalItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartTotalItems}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
              <Text style={styles.avatarText}>AD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* 📌 การ์ดสรุปสถิติคลังสินค้า */}
        <Text style={styles.sectionTitle}>สรุปภาพรวมคลังสินค้า</Text>
        <View style={styles.statsGridContainer}>
          <View style={[styles.statBoxCard, { backgroundColor: '#EAA43A' }]}>
            <Ionicons name="cube-outline" size={20} color="#FFF8E7" />
            <Text style={[styles.statValueText, { color: '#FFFFFF' }]}>{totalItems}</Text>
            <Text style={[styles.statLabelText, { color: '#FFF3D6' }]}>รายการสินค้า</Text>
          </View>

          <View style={[styles.statBoxCard, { backgroundColor: '#F2C94C' }]}>
            <Ionicons name="layers-outline" size={20} color="#5C4500" />
            <Text style={[styles.statValueText, { color: '#42362B' }]}>{totalStockUnits}</Text>
            <Text style={[styles.statLabelText, { color: '#5C4500' }]}>จำนวนสต็อก (เครื่อง)</Text>
          </View>

          <View style={[styles.statBoxCard, { backgroundColor: '#E06A55' }]}>
            <Ionicons name="alert-circle-outline" size={20} color="#FFF0EE" />
            <Text style={[styles.statValueText, { color: '#FFFFFF' }]}>{lowStockProducts.length}</Text>
            <Text style={[styles.statLabelText, { color: '#FFE4E0' }]}>สต็อกใกล้หมด</Text>
          </View>

          <View style={[styles.statBoxCard, { backgroundColor: '#D4A24E' }]}>
            <Ionicons name="wallet-outline" size={20} color="#FFFBF0" />
            <Text style={[styles.statValueText, { color: '#FFFFFF' }]}>฿{totalStockValue.toLocaleString()}</Text>
            <Text style={[styles.statLabelText, { color: '#FFF5DC' }]}>มูลค่าสต็อกรวม</Text>
          </View>
        </View>

        {/* 📌 รายการโปรเจกเตอร์ทั้งหมดในระบบ (กดเพิ่มใส่ตะกร้าได้) */}
        <Text style={styles.sectionTitle}>รายการโปรเจกเตอร์ทั้งหมด (สั่งซื้อสินค้า)</Text>
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
                    ฿{Number(item.price || 0).toLocaleString()} • คงเหลือ: {item.stock ?? 0} เครื่อง
                  </Text>
                </View>

                {/* 🛒 ปุ่มเพิ่มลงตะกร้าสินค้า */}
                <TouchableOpacity
                  style={[
                    styles.addToCartBtn,
                    (item.stock <= 0) && styles.disabledCartBtn
                  ]}
                  onPress={() => addToCart(item)}
                  disabled={item.stock <= 0}
                >
                  <Ionicons name="cart" size={15} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.addToCartText}>
                    {item.stock > 0 ? 'ใส่ตะกร้า' : 'หมด'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>ไม่พบข้อมูลโปรเจกเตอร์</Text>
          )}
        </View>

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
            
            {/* Header ของ Modal */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="cart" size={22} color="#EAA43A" style={{ marginRight: 8 }} />
                <Text style={styles.modalTitle}>ตะกร้าสินค้าของคุณ ({cartTotalItems})</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCartOpen(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={20} color="#42362B" />
              </TouchableOpacity>
            </View>

            {/* รายการสินค้าในตะกร้า */}
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <View key={item.id} style={styles.cartRow}>
                    <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="contain" />
                    
                    <View style={{ flex: 1, paddingHorizontal: 10 }}>
                      <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>฿{(item.price * item.quantity).toLocaleString()}</Text>
                    </View>

                    {/* ปุ่มปรับจำนวน + / - */}
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

            {/* สรุปราคารวมและปุ่มสั่งซื้อ */}
            {cart.length > 0 && (
              <View style={styles.cartFooter}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>ยอดรวมทั้งหมด:</Text>
                  <Text style={styles.totalValue}>฿{cartTotalAmount.toLocaleString()}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.checkoutBtnText}>ยืนยันสั่งซื้อสินค้า</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </Modal>

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
  container: { flex: 1, backgroundColor: '#FCF9EE' },
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
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#42362B', letterSpacing: 0.5 },
  menuTrigger: { backgroundColor: '#FAF4DF', padding: 8, borderRadius: 12 },
  
  // 🛒 สไตล์ปุ่มตะกร้าบน Header
  cartHeaderBtn: {
    backgroundColor: '#FAF4DF',
    padding: 8,
    borderRadius: 12,
    position: 'relative',
  },
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

  // 📊 สไตล์สำหรับการ์ดสถิติ
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
  statValueText: { fontSize: 22, fontWeight: '900', marginTop: 8 },
  statLabelText: { fontSize: 11, fontWeight: '600' },

  // ⚠️ สินค้าใกล้หมด
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
  lowStockName: { fontSize: 13, fontWeight: '700', color: '#42362B' },
  lowStockSubText: { fontSize: 10, color: '#A09385', marginTop: 2 },
  badgeWarnBtn: {
    backgroundColor: '#FFF4E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD8B5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWarnText: { color: '#E06A55', fontSize: 11, fontWeight: '800' },

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
  
  // 🛒 ปุ่มใส่ตะกร้าสินค้า
  addToCartBtn: {
    backgroundColor: '#EAA43A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledCartBtn: { backgroundColor: '#D4C8B5' },
  addToCartText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  noDataText: { textAlign: 'center', color: '#A09385', marginVertical: 14, fontSize: 12 },

  // 🛒 Modal ตะกร้าสินค้า
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(66, 54, 43, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF4DF',
  },
  modalTitle: { fontSize: 15, fontWeight: '800', color: '#42362B' },
  closeModalBtn: { backgroundColor: '#FAF4DF', padding: 6, borderRadius: 10 },
  
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF6E6',
  },
  cartItemImage: { width: 40, height: 40, borderRadius: 8 },
  cartItemName: { fontSize: 12, fontWeight: '700', color: '#42362B' },
  cartItemPrice: { fontSize: 11, color: '#EAA43A', fontWeight: '800', marginTop: 2 },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4DF',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
  },
  qtyBtn: { padding: 4 },
  qtyText: { fontSize: 12, fontWeight: '800', color: '#42362B', paddingHorizontal: 8 },
  deleteBtn: { padding: 6 },

  emptyCartContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyCartText: { marginTop: 8, color: '#A09385', fontSize: 13, fontWeight: '600' },

  cartFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#FAF4DF',
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#8C7E72' },
  totalValue: { fontSize: 18, fontWeight: '900', color: '#EAA43A' },
  checkoutBtn: {
    backgroundColor: '#EAA43A',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800' },

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