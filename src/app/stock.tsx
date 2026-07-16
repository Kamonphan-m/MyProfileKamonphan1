import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ข้อมูลเริ่มต้นสำหรับแสดงผลกรณีที่ยังไม่มีการเพิ่มสินค้าในเครื่อง
const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'WANDO WANDO X2 Max Smart Android Projector', price: '5,990 บ.', stock: 15, status: 'มีสินค้า', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400' },
  { id: '2', name: 'WANBO WANBO Mini Projector', price: '3,502 บ.', stock: 10, status: 'มีสินค้า', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400' },
];

export default function StockScreen() {
  const router = useRouter();
  const [projectors, setProjectors] = useState<any[]>([]);

  // 🛠️ ดึงข้อมูลใหม่จาก AsyncStorage ทุกครั้งที่หน้าจอนี้ถูกเปิดขึ้นมา (Focus)
  useFocusEffect(
    React.useCallback(() => {
      const loadProjectorData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('@vanta_products');
          
          if (savedData !== null) {
            // ดึงข้อมูลสินค้าที่บันทึกไว้
            const parsedData = JSON.parse(savedData);
            setProjectors(parsedData);
          } else {
            // ถ้าเปิดแอปครั้งแรกและยังไม่มีข้อมูล ให้ใช้ข้อมูลเริ่มต้นและบันทึกลงเครื่องไว้ก่อน
            await AsyncStorage.setItem('@vanta_products', JSON.stringify(INITIAL_PROJECTOR_DATA));
            setProjectors(INITIAL_PROJECTOR_DATA);
          }
        } catch (error) {
          console.error("Failed to load product data:", error);
        }
      };

      loadProjectorData();
    }, [])
  );

  // 🛠️ ฟังก์ชันสำหรับลบสินค้า
  const handleDelete = async (id: string) => {
    try {
      const updatedData = projectors.filter(item => item.id !== id);
      setProjectors(updatedData); // อัปเดต UI ทันที
      await AsyncStorage.setItem('@vanta_products', JSON.stringify(updatedData)); // บันทึกผลลัพธ์ใหม่ลงเครื่อง
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // ฟังก์ชันคำนวณสถานะสินค้า (สำหรับแสดงผลแท็กสถานะ)
  const getStatusText = (stock: number) => {
    if (stock === 0) return 'สินค้าหมด';
    if (stock <= 2) return 'สต็อกน้อย';
    return 'มีสินค้า';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header สไตล์ VANTA */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>คลังสินค้าโปรเจคเตอร์</Text>
        <TouchableOpacity onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* รายการสินค้า */}
      <FlatList
        data={projectors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          // ตรวจสอบความถูกต้องของโครงสร้างราคา
          const displayPrice = item.price.toString().includes('บ.') ? item.price : `${Number(item.price).toLocaleString()} บ.`;
          // ตรวจสอบความถูกต้องของภาพประกอบ หากไม่มีภาพให้สลับไปใช้ Placeholder อัตโนมัติ
          const displayImage = item.image && item.image.trim() !== '' ? item.image : 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400';
          const currentStatus = item.status || getStatusText(item.stock);

          return (
            <TouchableOpacity 
              style={styles.itemCard}
              onPress={() => router.push({
                pathname: '/product-detail',
                params: { 
                  name: item.name, 
                  price: displayPrice, 
                  stock: item.stock, 
                  image: displayImage 
                }
              })}
            >
              <View style={styles.leftContent}>
                <Image 
                  source={{ uri: displayImage }} 
                  style={styles.productImage} 
                  resizeMode="cover"
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>ราคา: {displayPrice}</Text>
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
                  {currentStatus}
                </Text>
                
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
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
  infoContainer: { flex: 1, paddingRight: 4 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#1E1B4B' },
  itemPrice: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  itemStock: { fontSize: 13, color: '#1E1B4B', fontWeight: '500', marginTop: 2 },
  rightContent: { alignItems: 'flex-end', justifyContent: 'space-between', height: 75 },
  statusTag: { fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  deleteBtn: { padding: 4, marginTop: 10 }
});