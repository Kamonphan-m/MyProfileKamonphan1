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
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="menu-outline" size={22} color="#6366F1" />
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
              <View style={styles.iconContainer}>
                <FontAwesome5 name={item.icon} size={20} color="#6366F1" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.itemsCount}>{item.itemsCount}</Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#4B5563" />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/stock')}>
          <MaterialCommunityIcons name="cube-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/categories')}>
          <Ionicons name="folder-open" size={20} color="#6366F1" />
          <Text style={[styles.navText, styles.navTextActive]}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  menuButton: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  brandDot: { color: '#6366F1' },
  avatar: {
    backgroundColor: '#6366F1',
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 12 },
  contentBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  pageTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 18,
    fontWeight: '500',
  },
  listContent: { paddingBottom: 100 },
  categoryCard: {
    backgroundColor: '#151F32',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1, justifyContent: 'center' },
  categoryName: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },
  itemsCount: { fontSize: 12, color: '#9CA3AF', marginTop: 3, fontWeight: '600' },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    zIndex: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  navTextActive: { color: '#6366F1', fontWeight: 'bold' },
});
