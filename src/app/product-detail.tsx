import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = useState<any>({ id: '', name: '', price: '0', stock: '0', image: '' });

  useEffect(() => {
    loadLiveDetails();
  }, [params.id]);

  const loadLiveDetails = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@lumen_products');
      if (storedData) {
        const products = JSON.parse(storedData);
        const currentItem = products.find((p: any) => p.id === params.id);
        if (currentItem) {
          setProduct(currentItem);
        } else {
          setProduct({
            id: params.id || '',
            name: params.name || '',
            price: params.price || '0',
            stock: params.stock || '0',
            image: params.image || ''
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const displayImage = product.image && product.image.trim() !== '' ? product.image : 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop';
  
  // 🔗 ดึงข้อมูลสินค้าทำเป็น JSON String เพื่อสร้าง QR
  const qrDataString = JSON.stringify({ id: product.id, name: product.name, price: product.price, stock: product.stock });
  
  // 🌐 ใช้บริการสร้าง QR Code ออนไลน์ฟรี (ทำให้แอปไม่ต้องลง Library เสริมให้พังอีกต่อไป!)
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=0b0f19&data=${encodeURIComponent(qrDataString)}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMINAL DETAILS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.detailCard}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: displayImage }} style={styles.productImage} resizeMode="cover" />
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.infoTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Price:</Text>
              <Text style={styles.tableValue}>{Number(product.price).toLocaleString()} บ.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Stock status:</Text>
              <Text style={[styles.tableValue, { color: Number(product.stock) > 0 ? '#10B981' : '#EF4444' }]}>
                {product.stock} Units
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => router.push({ pathname: '/add-product', params: { editId: product.id } })}
          >
            <Ionicons name="build-outline" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.editButtonText}>Modify Hardware Configuration</Text>
          </TouchableOpacity>
        </View>

        {/* ส่วนแสดง QR Code ด้วย API รูปภาพ */}
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Product QR Code Matrix</Text>
          <View style={styles.qrWrapper}>
            <Image 
              source={{ uri: qrCodeApiUrl }} 
              style={{ width: 140, height: 140 }} 
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  detailCard: { backgroundColor: '#151F32', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#1E293B', marginBottom: 20 },
  imageWrapper: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: '#1E293B', marginBottom: 20 },
  productImage: { width: '100%', height: '100%' },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  infoTable: { borderTopWidth: 1, borderTopColor: '#1F2937', paddingTop: 10 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  tableLabel: { fontSize: 13, color: '#9CA3AF' },
  tableValue: { fontSize: 13, color: '#FFF', fontWeight: 'bold' },
  editButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6366F1', paddingVertical: 14, borderRadius: 14, marginTop: 24 },
  editButtonText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  qrContainer: { backgroundColor: '#151F32', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  qrTitle: { fontSize: 12, fontWeight: '800', color: '#6366F1', marginBottom: 16 },
  qrWrapper: { backgroundColor: '#FFF', padding: 16, borderRadius: 20 }
});