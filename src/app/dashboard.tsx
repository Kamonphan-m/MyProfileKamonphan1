import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// 📊 ปรับความสูงของกราฟ และเพิ่มตัวเลขยอดสินค้าด้านบนให้ดูน่ารักและอ่านง่ายขึ้นค่ะ
const CHART_BARS = [
  { h: 70, l: 'Ready', count: '2' },
  { h: 110, l: 'Holding', count: '3' },
  { h: 30, l: 'Faulty', count: '0' },
  { h: 140, l: 'Active', count: '5' },
];

export default function DashboardScreen() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarAnim] = useState(new Animated.Value(-width * 0.75));

  const toggleMenu = () => {
    Animated.timing(sidebarAnim, {
      toValue: isMenuOpen ? -width * 0.75 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนแถบเมนูด้านข้าง (Sidebar) สไตล์มินิมอลอบอุ่น */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarLogo}>
            LUMEN<Text style={styles.brandDot}>.OS</Text>
          </Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuBtn}>
            <Ionicons name="close" size={22} color="#4A3525" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sidebarMenu} showsVerticalScrollIndicator={false}>
          {[
            { label: 'Control Center', icon: 'grid-outline', path: '/dashboard', active: true },
            { label: 'Insert Projector', icon: 'add-circle-outline', path: '/add-product' },
            { label: 'Warehouse Stock', icon: 'cube-outline', path: '/stock' },
            { label: 'Category Filter', icon: 'folder-open-outline', path: '/categories' },
            { label: 'Account Profile', icon: 'settings-outline', path: '/login' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.sidebarItem, item.active && styles.sidebarItemActive]}
              onPress={() => {
                toggleMenu();
                router.push(item.path as any);
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={item.active ? '#FFF' : '#A19288'}
                style={styles.sidebarIcon}
              />
              <Text style={item.active ? styles.sidebarTextActive : styles.sidebarText}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            toggleMenu();
            router.push('/login');
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#C25A5A" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Disconnect</Text>
        </TouchableOpacity>
      </Animated.View>

      {isMenuOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleMenu} />
      )}

      {/* Header หลักด้านบนสุดละมุน */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
          <Ionicons name="menu-outline" size={22} color="#4A3525" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DASHBOARD</Text>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
          <Text style={styles.avatarText}>AD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Real-time Analytics</Text>

        {/* 📊 ตารางสถิติปรับตัวเลขให้ตะมุตะมิ สมกับเป็นร้านเราจริง ๆ แล้วค่ะ */}
        <View style={styles.statsGrid}>
          {[
            { value: '5', title: 'IN STOCK', color: '#6D8771' },
            { value: '12', title: 'ORDERS', color: '#8D6E63' },
            { value: '0', title: 'RETURNS', color: '#C25A5A' },
            { value: '1', title: 'ALERT', color: '#C6A15B' },
            { value: '6', title: 'GROUPS', color: '#78909C' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.title}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.viewMoreCard} onPress={() => router.push('/stock')}>
            <Ionicons name="scan-outline" size={16} color="#4A3525" />
            <Text style={styles.viewMoreText}>EXPLORE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        
        {/* กล่องกราฟดีไซน์สะอาดตา */}
        <View style={styles.chartContainer}>
          <View style={styles.chartRow}>
            {CHART_BARS.map((bar, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <Text style={styles.barValueText}>{bar.count}</Text>
                <View style={[styles.bar, { height: bar.h }]} />
                <Text style={styles.barLabel}>{bar.l}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ✨ 🦄 แถบเนวิเกชั่นด้านล่างดีไซน์มินิมอลลอยตัวสุดคิ้วท์ (แมตช์เข้าคู่กันครบทุกหน้าแล้วค่ะ) */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid" size={22} color="#4A3525" />
          <Text style={[styles.tabText, styles.activeTabText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/stock')}>
          <Ionicons name="cube-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => router.push('/categories')}>
          <Ionicons name="grid-outline" size={22} color="#8A7A71" />
          <Text style={styles.tabText}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  scrollContainer: { padding: 20, paddingBottom: 140 }, // เพิ่มพื้นที่ดันด้านล่างขึ้น ไม่ให้เมนูลอยบังความสวยของกราฟค่ะ
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
  headerTitle: { fontSize: 14, fontWeight: '800', color: '#3E2723', letterSpacing: 1.5 },
  menuTrigger: { backgroundColor: '#F5F2EC', padding: 8, borderRadius: 12 },
  avatar: {
    backgroundColor: '#4A3525',
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 11 },
  
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8A7A71',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // การ์ดสถิติสีขาว มนโค้ง ละมุนตา
  statCard: {
    backgroundColor: '#FFF',
    width: '31%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: { fontSize: 20, fontWeight: '800' },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#A19288',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  viewMoreCard: {
    backgroundColor: '#F5F2EC',
    width: '31%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EDE9E2',
  },
  viewMoreText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4A3525',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  
  // ส่วนกล่องแสดงผลกราฟ
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    height: 200,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
  },
  barWrapper: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  bar: { backgroundColor: '#8D6E63', width: 18, borderRadius: 10 },
  barLabel: { fontSize: 10, color: '#A19288', marginTop: 8, fontWeight: '600' },
  barValueText: { fontSize: 10, fontWeight: '700', color: '#8D6E63', marginBottom: 4 },
  
  /* 🎨 ดีไซน์เมนูด้านล่างแบบลอยตัวละมุนใจสไตล์ Cozy Cafe */
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
  activeTabText: { color: '#4A3525', fontWeight: '800' },
  
  // เมนูด้านข้างเมื่อกดเปิด (Sidebar Drawer)
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '75%',
    backgroundColor: '#FFF',
    padding: 24,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EC',
  },
  sidebarLogo: { fontSize: 16, fontWeight: '900', color: '#3E2723', letterSpacing: 2 },
  brandDot: { color: '#8D6E63' },
  closeMenuBtn: { backgroundColor: '#F5F2EC', padding: 6, borderRadius: 10 },
  sidebarMenu: { marginTop: 24 },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  sidebarItemActive: { backgroundColor: '#4A3525' },
  sidebarIcon: { marginRight: 14 },
  sidebarText: { color: '#8A7A71', fontSize: 14, fontWeight: '600' },
  sidebarTextActive: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: { color: '#C25A5A', fontSize: 13, fontWeight: '700' },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(62, 39, 35, 0.4)',
    zIndex: 90,
  },
});