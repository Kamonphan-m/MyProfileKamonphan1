import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PROJECTOR_CATEGORIES = [
  { id: '1', name: 'Home Theater', itemsCount: '12 items', icon: 'film' },
  { id: '2', name: 'Portable & Mini', itemsCount: '8 items', icon: 'mobile-alt' },
  { id: '3', name: 'Office & Education', itemsCount: '15 items', icon: 'chalkboard-teacher' },
  { id: '4', name: '4K Ultra HD', itemsCount: '6 items', icon: 'tv' },
  { id: '5', name: 'Gaming Projectors', itemsCount: '5 items', icon: 'gamepad' },
  { id: '6', name: 'Accessories & Screens', itemsCount: '24 items', icon: 'plug' },
];

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนหัวแอปดีไซน์มินิมอลละมุนตา */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="menu-outline" size={22} color="#4A3525" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LUMEN<Text style={styles.brandDot}>.OS</Text></Text>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
          <Text style={styles.avatarText}>AD</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentBody}>
        <Text style={styles.pageTitle}>CATEGORY MATRIX</Text>
        <Text style={styles.pageSubtitle}>Filter inventory by projector classification</Text>

        <FlatList
          data={PROJECTOR_CATEGORIES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push('/stock')}
            >
              {/* วงกลมไอคอนโทนครีมน้ำตาลอบอุ่น */}
              <View style={styles.iconContainer}>
                <FontAwesome5 name={item.icon} size={18} color="#8D6E63" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.itemsCount}>{item.itemsCount}</Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#A19288" />
            </TouchableOpacity>
          )}
        />
      </View>

      {/* แถบเนวิเกเตอร์ด้านล่างสีขาวหรู สะอาดตา */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid-outline" size={20} color="#A19288" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={20} color="#A19288" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/stock')}>
          <MaterialCommunityIcons name="cube-outline" size={20} color="#A19288" />
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/categories')}>
          <Ionicons name="folder-open" size={20} color="#4A3525" />
          <Text style={[styles.navText, styles.navTextActive]}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // พื้นหลังสีครีมนวลนุ่ม Cozy มินิมอล
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9E2',
  },
  menuButton: { backgroundColor: '#F5F2EC', padding: 8, borderRadius: 12 },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#3E2723', letterSpacing: 2 },
  brandDot: { color: '#8D6E63' },
  avatar: {
    backgroundColor: '#4A3525',
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 11 },
  
  contentBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  pageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3E2723',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 11,
    color: '#A19288',
    marginBottom: 20,
    fontWeight: '500',
  },
  listContent: { paddingBottom: 110 },
  
  // การ์ดหมวดหมู่สีขาว ขอบมน มีเงานุ่มนวลน่ารัก
  categoryCard: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F5F2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1, justifyContent: 'center' },
  categoryName: { fontSize: 14, fontWeight: '700', color: '#3E2723' },
  itemsCount: { fontSize: 11, color: '#A19288', marginTop: 3, fontWeight: '600' },
  
  // แถบเมนูด้านล่างสุดคลีน
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EDE9E2',
    paddingBottom: 8,
    zIndex: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, color: '#A19288', marginTop: 4, fontWeight: '600' },
  navTextActive: { color: '#4A3525', fontWeight: '800' },
});