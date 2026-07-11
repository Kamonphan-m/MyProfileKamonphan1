import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'Epson EB-X06', price: '14,500 บ.', stock: 5, status: 'มีสินค้า', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400' },
  { id: '2', name: 'BenQ TH585P', price: '21,900 บ.', stock: 2, status: 'สต็อกน้อย', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400' },
];

export default function StockScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { 
    newProductName, productName, name,
    newProductBrand, productBrand, brand,
    newProductPrice, productPrice, price,
    newProductStock, productStock, stock,
    newProductImage, productImage, imageUri, image 
  } = params;

  const [projectors, setProjectors] = useState<any[]>([]);

  useEffect(() => {
    const handleSyncData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@projector_products');
        let currentList = savedData !== null ? JSON.parse(savedData) : INITIAL_PROJECTOR_DATA;

        const finalName = newProductName || productName || name;
        const finalPrice = newProductPrice || productPrice || price;
        const finalBrand = newProductBrand || productBrand || brand;
        const finalStock = newProductStock || productStock || stock;
        const finalImage = newProductImage || productImage || imageUri || image;

        if (finalName && finalPrice) {
          const stockNum = parseInt(finalStock as string, 10) || 0;
          let calculatedStatus = 'มีสินค้า';
          if (stockNum === 0) {
            calculatedStatus = 'สินค้าหมด';
          } else if (stockNum <= 2) {
            calculatedStatus = 'สต็อกน้อย';
          }

          const newProduct = {
            id: Date.now().toString(),
            name: `${finalBrand ? finalBrand + ' ' : ''}${finalName}`,
            price: `${Number(finalPrice).toLocaleString()} บ.`,
            stock: stockNum,
            status: calculatedStatus,
            image: (finalImage as string) || 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400'
          };

          currentList = [newProduct, ...currentList];
          await AsyncStorage.setItem('@projector_products', JSON.stringify(currentList));
          
          router.setParams({ 
            newProductName: '', productName: '', name: '',
            newProductPrice: '', productPrice: '', price: '' 
          });
        }

        setProjectors(currentList);
      } catch (e) {
        console.log(e);
      }
    };

    handleSyncData();
  }, [newProductName, productName, name, newProductPrice, productPrice, price]);

  const handleDelete = async (id: string) => {
    const updatedData = projectors.filter(item => item.id !== id);
    setProjectors(updatedData);
    await AsyncStorage.setItem('@projector_products', JSON.stringify(updatedData));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>คลังสินค้าโปรเจคเตอร์</Text>
        <TouchableOpacity onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={projectors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          /* 🛠️ เพิ่มคำสั่ง onPress ตรงนี้: กดปุ๊บ วิ่งไปหน้ารายละเอียดพร้อมส่งค่าข้อมูลไปด้วยทันที */
          <TouchableOpacity 
            style={styles.itemCard}
            onPress={() => router.push({
              pathname: '/product-detail', // จิ้มแล้วจะเปิดหน้า product-detail.tsx สไตล์ของเพื่อน
              params: { 
                name: item.name, 
                price: item.price, 
                stock: item.stock, 
                image: item.image 
              }
            })}
          >
            <View style={styles.leftContent}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.productImage} 
                resizeMode="cover"
              />
              <View style={styles.infoContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>ราคา: {item.price}</Text>
                <Text style={styles.itemStock}>คงเหลือ: {item.stock} เครื่อง</Text>
              </View>
            </View>

            <View style={styles.rightContent}>
              <Text style={[
                styles.statusTag, 
                { 
                  backgroundColor: item.stock === 0 ? '#FEE2E2' : item.stock <= 2 ? '#FEF3C7' : '#D1FAE5',
                  color: item.stock === 0 ? '#EF4444' : item.stock <= 2 ? '#D97706' : '#10B981' 
                }
              ]}>
                {item.status}
              </Text>
              
              {/* ปุ่มลบสินค้าคงไว้เหมือนเดิมเพื่อจัดการข้อมูล */}
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF' },
  itemCard: { backgroundColor: '#fff', padding: 14, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 15, marginTop: 12, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  productImage: { width: 75, height: 75, borderRadius: 10, backgroundColor: '#E5E7EB', marginRight: 12 },
  infoContainer: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#1E1B4B' },
  itemPrice: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  itemStock: { fontSize: 13, color: '#1E1B4B', fontWeight: '500', marginTop: 2 },
  rightContent: { alignItems: 'flex-end', justifyContent: 'space-between', height: 75 },
  statusTag: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  deleteBtn: { padding: 4, marginTop: 10 }
});