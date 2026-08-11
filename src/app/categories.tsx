import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PROJECTOR_CATEGORIES = [
  { id: '1', name: 'Cozy Home Cinema', itemsCount: '2 items', icon: 'film-outline' },
  { id: '2', name: 'Mini & Portable', itemsCount: '1 item', icon: 'videocam-outline' },
  { id: '3', name: 'Office & Education', itemsCount: '2 items', icon: 'easel-outline' },
  { id: '4', name: '4K Ultra HD Premium', itemsCount: '0 items', icon: 'tv-outline' },
  { id: '5', name: 'Pro Gaming Station', itemsCount: '0 items', icon: 'game-controller-outline' },
  { id: '6', name: 'Accessories & Screens', itemsCount: '0 items', icon: 'hardware-chip-outline' },
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
                <Ionicons name={item.icon as any} size={20} color="#8D6E63" />
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

      {/* ✨ แถบเนวิเกชั่นด้านล่างดีไซน์แมตช์คู่หน้า Stock 100% */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Add</Text>
        </TouchableOpacity>

        {/* 📦 ปรับเปลี่ยนมาใช้ไอคอน cube ทึบ ให้สวยงามตรงกับหน้า Stock แล้วครับ */}
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/stock')}>
          <Ionicons name="cube" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/categories')}>
          <Ionicons name="grid" size={22} color="#4A3525" />
          <Text style={[styles.tabText, styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  listContent: { paddingBottom: 140 },
  
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
  
  bottomTabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EDE9E2',
    zIndex: 10
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', width: 65, height: 50 },
  tabText: { fontSize: 10, color: '#A19288', fontWeight: '600', marginTop: 4 },
  activeTabText: { color: '#4A3525', fontWeight: '800' }
});