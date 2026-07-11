import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// หมายเหตุ: สำหรับ QR Code ถ้าหนูมี library เช่น react-native-qrcode-svg ให้เรียกใช้ได้เลย 
// แต่ในโค้ดนี้พี่จะใช้ Image จาก URL ตัวอย่างของ QR Code เพื่อความง่ายและไม่ขึ้น Error นะคะ

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ดักรับค่าสินค้าที่กดจิ้มเข้ามาแสดงผล
  const { name, price, stock, image, brand } = params;

  // จัดการข้อมูลให้สวยงาม
  const displayName = name ? String(name) : 'ไม่ได้ระบุชื่อสินค้า';
  const displayPrice = price ? String(price) : '0 บ.';
  const displayStock = stock ? String(stock) : '0';
  const displayImage = image ? String(image) : 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600';

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header ด้านบนสุด สไตล์มืดหรูแบบ VANTA */}
      <View style={styles.vantaHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.vantaTitle}>VANTA</Text>
        <View style={styles.vantaAvatar}>
          <Text style={styles.avatarText}>V</Text>
        </View>
      </View>

      {/* 2. การ์ดขาวตรงกลางแสดงรายละเอียดสินค้า */}
      <View style={styles.detailCard}>
        
        {/* รูปโปรเจคเตอร์ขนาดใหญ่ตรงกลาง */}
        <Image 
          source={{ uri: displayImage }} 
          style={styles.mainProductImage} 
          resizeMode="contain"
        />

        {/* ชื่อรุ่นโปรเจคเตอร์ตัวหนา */}
        <Text style={styles.productNameText}>{displayName}</Text>

        {/* ตารางรายละเอียดสไตล์ของเพื่อน */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price:</Text>
          <Text style={styles.infoValue}>{displayPrice}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Stock:</Text>
          <Text style={styles.infoValue}>{displayStock}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>Projector</Text>
        </View>

        {/* เส้นประคั่นกลาง */}
        <View style={styles.dottedLine} />

        {/* ส่วนแสดง Product QR Code */}
        <Text style={styles.qrTitle}>Product QR Code</Text>
        
        {/* รูป QR Code จำลอง (จะเปลี่ยนตาม ID สินค้าหรือใช้รูปกลางแบบเพื่อนก็ได้ค่ะ) */}
        <Image 
          source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${displayName}` }} 
          style={styles.qrImage} 
        />
        
        <Text style={styles.qrSubtitle}>Scan to manage inventory item</Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF1F7' }, // พื้นหลังสีเทาอมฟ้าอ่อนๆ แบบของเพื่อน
  
  // Header ดีไซน์ VANTA สีดำ
  vantaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0B0F19', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { backgroundColor: '#3B82F6', padding: 6, borderRadius: 6 }, // ปุ่มย้อนกลับสีฟ้าแบบในรูปเป๊ะๆ
  vantaTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  vantaAvatar: { backgroundColor: '#FFF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#0B0F19', fontSize: 14 },
  
  // การ์ดขาวแสดงข้อมูล
  detailCard: { backgroundColor: '#FFF', margin: 15, borderRadius: 24, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  mainProductImage: { width: '80%', height: 200, marginBottom: 20, backgroundColor: '#F9FAFB', borderRadius: 12 },
  productNameText: { fontSize: 20, fontWeight: 'bold', color: '#0B0F19', alignSelf: 'flex-start', marginBottom: 20 },
  
  // แถวข้อมูล Price / Stock
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  infoLabel: { fontSize: 15, color: '#6B7280', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#0B0F19', fontWeight: 'bold' },
  
  // เส้นประและ QR Code
  dottedLine: { width: '100%', height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB', marginVertical: 20, borderRadius: 1 },
  qrTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
  qrImage: { width: 130, height: 130, marginVertical: 5 },
  qrSubtitle: { fontSize: 11, color: '#9CA3AF', marginTop: 8 }
});