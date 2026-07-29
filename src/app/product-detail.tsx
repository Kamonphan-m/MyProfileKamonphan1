import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ดึงข้อมูลที่ส่งมาจาก Query Parameters (URL)
  const name = (params.name as string) || 'Projector Details';
  const price = params.price ? Number(params.price).toLocaleString() : '0';
  const stock = params.stock || '0';
  const image = (params.image as string) || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop';

  return (
    <SafeAreaView style={styles.container}>
      {/* 🤎 Header ธีมน้ำตาล-ครีม มินิมอล */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#4A3525" />
        </TouchableOpacity>

        <View style={styles.brandTitleContainer}>
          <Text style={styles.headerTitle}>PROJECTOR DETAILS</Text>
          <Text style={styles.subBrandTitle}>LUMEN PROJECTOR MANAGEMENT</Text>
        </View>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 🖼️ แสดงรูปภาพโปรเจกเตอร์จริง */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* 📝 รายละเอียดสินค้าจริง */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{name}</Text>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.priceValue}>฿{price}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Stock status:</Text>
            <Text style={styles.stockValue}>{stock} Units</Text>
          </View>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Ionicons name="build-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.actionButtonText}>Modify Hardware Configuration</Text>
          </TouchableOpacity>
        </View>

        {/* 🔳 QR Code สินค้า */}
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Product QR Code Matrix</Text>
          <Image
            source={{
              uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(name)}`
            }}
            style={styles.qrImage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9E2',
  },
  backBtn: {
    backgroundColor: '#F5F2EC',
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitleContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#3E2723', letterSpacing: 1.2 },
  subBrandTitle: { fontSize: 8, fontWeight: '700', color: '#A19288', letterSpacing: 0.8, marginTop: 2 },

  scrollContent: { padding: 16, paddingBottom: 40 },
  
  imageCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDE9E2',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  productImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F2EC',
  },

  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EDE9E2',
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3E2723',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F2EC',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 13, color: '#8A7A71', fontWeight: '500' },
  priceValue: { fontSize: 15, fontWeight: '800', color: '#3E2723' },
  stockValue: { fontSize: 13, fontWeight: '700', color: '#6D8771' },

  actionButton: {
    backgroundColor: '#4A3525',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  actionButtonText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  qrCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9E2',
    elevation: 2,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  qrTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A7A71',
    marginBottom: 14,
  },
  qrImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
});