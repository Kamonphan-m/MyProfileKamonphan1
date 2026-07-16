import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'WANDO WANDO X2 Max Smart Android Projector', price: '5,990 บ.', stock: 15, status: 'มีสินค้า' },
  { id: '2', name: 'WANBO WANBO Mini Projector', price: '3,502 บ.', stock: 10, status: 'มีสินค้า' },
];

export default function StockScreen() {
  const router = useRouter();
  const [projectors, setProjectors] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadProjectorData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('@vanta_products');
          if (savedData !== null) {
            setProjectors(JSON.parse(savedData));
          } else {
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

  const handleDelete = async (id: string) => {
    try {
      const updatedData = projectors.filter(item => item.id !== id);
      setProjectors(updatedData);
      await AsyncStorage.setItem('@vanta_products', JSON.stringify(updatedData));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getStatusText = (stock: number) => {
    if (stock === 0) return 'OUT OF STOCK';
    if (stock <= 2) return 'LOW STOCK';
    return 'AVAILABLE';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header สไตล์นีออนล้ำยุค */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMINAL STOCK</Text>
        <TouchableOpacity onPress={() => router.push('/add-product')} style={styles.navBtn}>
          <Ionicons name="add" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={projectors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const displayPrice = item.price.toString().includes('บ.') ? item.price : `${Number(item.price).toLocaleString()} บ.`;
          const currentStatus = getStatusText(item.stock);

          return (
            <TouchableOpacity 
              style={styles.itemCard}
              onPress={() => router.push({
                pathname: '/product-detail',
                params: { name: item.name, price: displayPrice, stock: item.stock }
              })}
            >
              {/* ย้ายรายละเอียดมาฝั่งซ้ายทั้งหมด (ไม่มี Component รูปภาพแล้ว) */}
              <View style={styles.infoContainer}>
                <View style={styles.badgeRow}>
                  <Text style={[
                    styles.statusTag, 
                    { 
                      backgroundColor: item.stock === 0 ? '#2D1F29' : item.stock <= 2 ? '#2A241F' : '#1A2E26',
                      color: item.stock === 0 ? '#EF4444' : item.stock <= 2 ? '#F59E0B' : '#10B981' 
                    }
                  ]}>
                    {currentStatus}
                  </Text>
                  <Text style={styles.itemStock}>QTY: {item.stock} Units</Text>
                </View>
                
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>{displayPrice}</Text>
              </View>

              {/* ฝั่งขวารวมปุ่มคำสั่งการจัดการเป็นสัดส่วนชัดเจน */}
              <View style={styles.rightContent}>
                <View style={styles.actionRow}>
                  <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => router.push({ pathname: '/add-product', params: { editId: item.id } })}
                  >
                    <Ionicons name="settings-outline" size={14} color="#38BDF8" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' }, // เปลี่ยนเป็นพื้นหลังห้องมืดสไตล์ระบบเซิร์ฟเวอร์
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#111827', 
    paddingHorizontal: 20, 
    paddingVertical: 18, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1F2937' 
  },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  itemCard: { 
    backgroundColor: '#151F32', 
    padding: 16, 
    borderRadius: 20, 
    flexDirection: 'row', 
    marginHorizontal: 16, 
    marginTop: 14, 
    borderWidth: 1, 
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  infoContainer: { flex: 1, justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusTag: { fontSize: 8, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, overflow: 'hidden', letterSpacing: 0.5, marginRight: 10 },
  itemStock: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  itemPrice: { fontSize: 13, color: '#6366F1', fontWeight: '700', marginTop: 4 },
  rightContent: { justifyContent: 'center', alignItems: 'flex-end', marginLeft: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  editBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10, marginRight: 8 },
  deleteBtn: { backgroundColor: '#2D1F29', padding: 8, borderRadius: 10 }
});