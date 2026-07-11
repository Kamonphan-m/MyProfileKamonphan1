import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 1. กำหนดหมวดหมู่สินค้าเกี่ยวกับ "โปรเจคเตอร์" ของหนู
const PROJECTOR_CATEGORIES = [
  { id: '1', name: 'Home Theater', itemsCount: '12 items', icon: 'projector' as const },
  { id: '2', name: 'Portable & Mini', itemsCount: '8 items', icon: 'video-portable' as const },
  { id: '3', name: 'Office & Education', itemsCount: '15 items', icon: 'presentation' as const },
  { id: '4', name: '4K Ultra HD', itemsCount: '6 items', icon: 'television-shading' as const },
  { id: '5', name: 'Gaming Projectors', itemsCount: '5 items', icon: 'gamepad-variant' as const },
  { id: '6', name: 'Accessories & Screens', itemsCount: '24 items', icon: '围巾' as const, isIonicons: true, ionIconName: 'hardware-chip-outline' as const },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* 2. Header ด้านบนสุด สไตล์ VANTA มืดหรูแบบของเพื่อน */}
      <View style={styles.vantaHeader}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.vantaTitle}>VANTA</Text>
        <View style={styles.vantaAvatar}>
          <Text style={styles.avatarText}>V</Text>
        </View>
      </View>

      {/* 3. เนื้อหาหลักด้านใน */}
      <View style={styles.contentBody}>
        <Text style={styles.pageTitle}>Categories</Text>

        {/* รายการหมวดหมู่การ์ดขาว มน ๆ สวย ๆ แบบเพื่อน */}
        <FlatList
          data={PROJECTOR_CATEGORIES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => router.push('/stock')} // เมื่อกดแล้วจะลิงก์ไปหน้าคลังสินค้าโปรเจคเตอร์ที่ทำไว้
            >
              {/* กล่องใส่ไอคอนสี่เหลี่ยมโค้งมนสีฟ้าอ่อนด้านซ้าย */}
              <View style={styles.iconContainer}>
                {item.isIonicons ? (
                  <Ionicons name={item.ionIconName} size={24} color="#3B82F6" />
                ) : (
                  <MaterialCommunityIcons name={item.icon as any} size={26} color="#3B82F6" />
                )}
              </View>

              {/* ข้อความหมวดหมู่สินค้า */}
              <View style={styles.textContainer}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.itemsCount}>{item.itemsCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDF1F7' }, // พื้นหลังสีเทาอมฟ้าสว่างแบบเพื่อนเป๊ะ ๆ
  
  // Header แบรนด์ VANTA สีเข้มมืด
  vantaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0B0F19', paddingHorizontal: 20, paddingVertical: 15 },
  menuButton: { padding: 4 },
  vantaTitle: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  vantaAvatar: { backgroundColor: '#FFF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#0B0F19', fontSize: 14 },

  contentBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0B0F19', marginBottom: 15 },
  
  // การ์ดขาวแสดงหมวดหมู่สินค้า
  categoryCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  iconContainer: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { justifyContent: 'center' },
  categoryName: { fontSize: 16, fontWeight: 'bold', color: '#0B0F19' },
  itemsCount: { fontSize: 13, color: '#9CA3AF', marginTop: 2 }
});