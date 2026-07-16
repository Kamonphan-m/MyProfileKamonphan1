import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'WANBO X2 Max Smart Android Projector', price: '5990', stock: '15', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '2', name: 'WANBO Mini Projector', price: '3502', stock: '10', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '3', name: 'WANBO Projector Android 9.0 / Mozart', price: '17590', stock: '15', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'ACER Projector x 1328wi', price: '17390', stock: '15', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '5', name: 'Epson Projector / EB-E24', price: '17790', stock: '25', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
];

export default function StockScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  // โหลดข้อมูลขึ้นมาใหม่ทุกครั้งที่หน้านี้ถูกเปิดใช้งาน
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@lumen_products');
      if (storedData) {
        setProducts(JSON.parse(storedData));
      } else {
        // หากไม่มีข้อมูลในเครื่อง ให้ใช้ข้อมูลเริ่มต้นเซฟลงเครื่องก่อน
        await AsyncStorage.setItem('@lumen_products', JSON.stringify(INITIAL_PROJECTOR_DATA));
        setProducts(INITIAL_PROJECTOR_DATA);
      }
    } catch (error) {
      console.error(error);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMINAL STOCK</Text>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={() => router.push('/add-product')}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentBody}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
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
                    <View style={styles.badgeRow}>
                      <View style={[styles.badge, { backgroundColor: Number(item.stock) > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
                        <Text style={[styles.badgeText, { color: Number(item.stock) > 0 ? '#10B981' : '#EF4444' }]}>
                          {Number(item.stock) > 0 ? 'AVAILABLE' : 'OUT OF STOCK'}
                        </Text>
                      </View>
                      <Text style={styles.qtyText}>QTY: {item.stock} Units</Text>
                    </View>
                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.productPrice}>{Number(item.price).toLocaleString()} บ.</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.gearBtn}
                    onPress={() => router.push({ pathname: '/add-product', params: { editId: item.id } })}
                  >
                    <Ionicons name="settings-outline" size={16} color="#6366F1" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProduct(item.id)}>
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  addHeaderBtn: { backgroundColor: '#6366F1', padding: 8, borderRadius: 10 },
  contentBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  productCard: { backgroundColor: '#151F32', borderRadius: 20, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#1E293B', justifyContent: 'space-between' },
  cardPressable: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  productImage: { width: 55, height: 55, borderRadius: 12, backgroundColor: '#1E293B', marginRight: 15 },
  infoContainer: { flex: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 },
  badgeText: { fontSize: 8, fontWeight: 'bold' },
  qtyText: { fontSize: 10, color: '#9CA3AF' },
  productName: { fontSize: 13, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  productPrice: { fontSize: 12, color: '#6366F1', fontWeight: '700' },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  gearBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  deleteBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', justifyContent: 'center', alignItems: 'center' }
});