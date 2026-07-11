import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// จำลองข้อมูลเริ่มต้นในร้าน
const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'Epson EB-X06', price: '14,500 บ.', stock: 5, status: 'มีสินค้า' },
  { id: '2', name: 'BenQ TH585P', price: '21,900 บ.', stock: 2, status: 'สต็อกน้อย' },
  { id: '3', name: 'Acer X1126AH', price: '11,900 บ.', stock: 0, status: 'สินค้าหมด' },
];

export default function StockScreen() {
  const router = useRouter();
  
  // 🛠️ 1. ดึงค่า Params ที่ส่งมาจากหน้า add-product
  const params = useLocalSearchParams();
  const { newProductName, newProductBrand, newProductPrice, newProductStock } = params;

  // 🛠️ 2. เปลี่ยนมาใช้ useState เพื่อให้ข้อมูลอัปเดตและเพิ่มเข้าลิสต์ได้จริง
  const [projectors, setProjectors] = useState(INITIAL_PROJECTOR_DATA);

  // 🛠️ 3. ตรวจจับว่ามีข้อมูลส่งมาจากหน้า Add ไหม ถ้ามีให้เอามาต่อหัวลิสต์
  useEffect(() => {
    if (newProductName && newProductPrice && newProductStock) {
      const stockNum = parseInt(newProductStock as string, 10) || 0;
      
      // ฟังก์ชันคำนวณสถานะอัตโนมัติจากจำนวนสต็อกที่กรอก
      let calculatedStatus = 'มีสินค้า';
      if (stockNum === 0) {
        calculatedStatus = 'สินค้าหมด';
      } else if (stockNum <= 2) {
        calculatedStatus = 'สต็อกน้อย';
      }

      const newProduct = {
        id: Date.now().toString(), // สร้าง ID แบบไม่ซ้ำกัน
        name: `${newProductBrand ? newProductBrand + ' ' : ''}${newProductName}`,
        price: `${Number(newProductPrice).toLocaleString()} บ.`, // แปลงเป็นฟอร์แมตเงินบาทให้สวยงาม
        stock: stockNum,
        status: calculatedStatus
      };

      // ตรวจสอบไม่ให้ไอเทมซ้ำตอนเปลี่ยนสเตทหน้าจอ
      setProjectors((prevData) => {
        const isExist = prevData.some(item => item.name === newProduct.name && item.price === newProduct.price);
        if (isExist) return prevData;
        return [newProduct, ...prevData]; // เอาสินค้าชิ้นใหม่ไว้บนสุด
      });
    }
  }, [newProductName, newProductBrand, newProductPrice, newProductStock]);

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนหัวหน้าจอ */}
      <View style={styles.header}>
        {/* ปรับให้ปุ่มย้อนกลับวิ่งไปที่หน้า Dashboard เพื่อความเสถียรของแอป */}
        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>คลังสินค้าโปรเจคเตอร์</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* รายการสินค้า */}
      <FlatList
        data={projectors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>ราคา: {item.price}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.itemStock}>คงเหลือ: {item.stock} เครื่อง</Text>
              <Text style={[
                styles.statusTag, 
                { 
                  backgroundColor: item.stock === 0 ? '#FEE2E2' : item.stock <= 2 ? '#FEF3C7' : '#D1FAE5',
                  color: item.stock === 0 ? '#EF4444' : item.stock <= 2 ? '#D97706' : '#10B981' 
                }
              ]}>
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6', 
    paddingHorizontal: 20 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginVertical: 20 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1E1B4B' 
  },
  itemCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1E1B4B' 
  },
  itemPrice: { 
    fontSize: 14, 
    color: '#6B7280', 
    marginTop: 4 
  },
  itemStock: { 
    fontSize: 14, 
    color: '#1E1B4B', 
    fontWeight: '500' 
  },
  statusTag: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6, 
    marginTop: 6, 
    overflow: 'hidden' 
  }
});