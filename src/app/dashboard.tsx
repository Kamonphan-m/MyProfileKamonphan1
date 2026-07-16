import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

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
      {/* 🌌 Sidebar Menu (LUMEN.OS Premium Dark Style) */}
      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarLogo}>LUMEN<Text style={styles.brandDot}>.OS</Text></Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeMenuBtn}>
            <Ionicons name="close" size={24} color="#6366F1" />
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
              onPress={() => { toggleMenu(); router.push(item.path as any); }}
            >
              <Ionicons name={item.icon as any} size={20} color={item.active ? '#FFF' : '#9CA3AF'} style={styles.sidebarIcon} />
              <Text style={item.active ? styles.sidebarTextActive : styles.sidebarText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={() => { toggleMenu(); router.push('/login'); }}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Terminal Disconnect</Text>
        </TouchableOpacity>
      </Animated.View>

      {isMenuOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleMenu} />}

      {/* ⚡ Main Content Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
          <Ionicons name="menu-outline" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMINAL MATRIX</Text>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
          <Text style={styles.avatarText}>AD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Real-time Analytics</Text>
        
        {/* 📊 Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { value: '741', title: 'IN STOCK', color: '#10B981' },
            { value: '123', title: 'ORDERS', color: '#6366F1' },
            { value: '12', title: 'RETURNS', color: '#EF4444' },
            { value: '1', title: 'ALERT', color: '#F59E0B' },
            { value: '4', title: 'GROUPS', color: '#38BDF8' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.title}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.viewMoreCard} onPress={() => router.push('/stock')}>
            <Ionicons name="scan-outline" size={18} color="#6366F1" />
            <Text style={styles.viewMoreText}>EXPLORE</Text>
          </TouchableOpacity>
        </View>

        {/* 📉 Performance Metrics (แก้ไขความสูงแบบตัวเลขผ่านฉลุย ไร้ Error) */}
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartRow}>
            {[
              { h: 70, l: 'Ready' },
              { h: 130, l: 'Holding' },
              { h: 45, l: 'Faulty' },
              { h: 150, l: 'Active' },
            ].map((bar, idx) => (
              <View key={idx} style={styles.barWrapper}>
                <View style={[styles.bar, { height: bar.h }]} />
                <Text style={styles.barLabel}>{bar.l}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 🗺️ Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid" size={20} color="#6366F1" />
          <Text style={[styles.navText, { color: '#6366F1', fontWeight: 'bold' }]}>Home</Text>
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
          <Ionicons name="folder-open-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  scrollContainer: { padding: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  menuTrigger: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  avatar: { backgroundColor: '#6366F1', width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 12 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#6366F1', marginTop: 26, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1.5 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { backgroundColor: '#151F32', width: '31%', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1E293B' },
  statNumber: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 9, fontWeight: '800', color: '#9CA3AF', marginTop: 6, letterSpacing: 0.5 },
  viewMoreCard: { backgroundColor: '#1E293B', width: '31%', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#6366F1' },
  viewMoreText: { fontSize: 9, fontWeight: '800', color: '#6366F1', marginTop: 4, letterSpacing: 0.5 },
  chartContainer: { backgroundColor: '#151F32', borderRadius: 24, padding: 20, height: 200, borderWidth: 1, borderColor: '#1E293B' },
  chartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' },
  barWrapper: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { backgroundColor: '#6366F1', width: 16, borderRadius: 8 },
  barLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 8, fontWeight: '600' },
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#111827', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1F2937', zIndex: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  sidebar: { position: 'absolute', top: 0, bottom: 0, width: '75%', backgroundColor: '#111827', padding: 24, zIndex: 100 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  sidebarLogo: { fontSize: 16, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  brandDot: { color: '#6366F1' },
  closeMenuBtn: { backgroundColor: '#1E293B', padding: 6, borderRadius: 8 },
  sidebarMenu: { marginTop: 24 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8 },
  sidebarItemActive: { backgroundColor: '#6366F1' },
  sidebarIcon: { marginRight: 14 },
  sidebarText: { color: '#9CA3AF', fontSize: 14, fontWeight: '600' },
  sidebarTextActive: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  logoutButton: { position: 'absolute', bottom: 40, left: 24, flexDirection: 'row', alignItems: 'center', backgroundColor: '#2D1F29', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: 'bold' },
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 90 }
});