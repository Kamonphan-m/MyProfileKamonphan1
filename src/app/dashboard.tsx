import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const { width } = Dimensions.get('window');
export default function DashboardScreen() {
 const router = useRouter();
 // 1. เพิ่ม State สำหรับควบคุมการเปิด-ปิด เมนูด้านข้าง (Sidebar)
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [sidebarAnim] = useState(new Animated.Value(-width * 0.7)); // ซ่อนเมนูไว้ทางซ้ายสุดก่อน
 // ฟังก์ชันสลับการเปิด-ปิดเมนูด้านข้าง
 const toggleMenu = () => {
   if (isMenuOpen) {
     Animated.timing(sidebarAnim, { toValue: -width * 0.7, duration: 250, useNativeDriver: false }).start();
   } else {
     Animated.timing(sidebarAnim, { toValue: 0, duration: 250, useNativeDriver: false }).start();
   }
   setIsMenuOpen(!isMenuOpen);
 };
 return (
<SafeAreaView style={styles.container}>
     {/* ==================== 2. เมนูด้านข้าง (Sidebar Menu) สไตล์ VANTA ==================== */}
<Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
<View style={styles.sidebarHeader}>
<TouchableOpacity onPress={toggleMenu}>
<Ionicons name="close" size={28} color="#FFF" />
</TouchableOpacity>
<Text style={styles.sidebarLogo}>VANTA</Text>
<View style={{ width: 28 }} />
</View>
<View style={styles.sidebarMenu}>
<TouchableOpacity style={[styles.sidebarItem, styles.sidebarItemActive]} onPress={toggleMenu}>
<Text style={styles.sidebarIcon}>🏠</Text>
<Text style={styles.sidebarTextActive}>Home Dashboard</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.sidebarItem} onPress={() => { toggleMenu(); router.push('/add-product'); }}>
<Text style={styles.sidebarIcon}>➕</Text>
<Text style={styles.sidebarText}>Add Product</Text>
</TouchableOpacity>
<View style={styles.sidebarMenu}>

  <TouchableOpacity
    style={[styles.sidebarItem, styles.sidebarItemActive]}
    onPress={toggleMenu}
  >
    <Text style={styles.sidebarIcon}>🏠</Text>
    <Text style={styles.sidebarTextActive}>Home Dashboard</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.sidebarItem}
    onPress={() => {
      toggleMenu();
      router.push('/add-product');
    }}
  >
    <Text style={styles.sidebarIcon}>➕</Text>
    <Text style={styles.sidebarText}>Add Product</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.sidebarItem}
    onPress={() => {
      toggleMenu();
      router.push('/stock');
    }}
  >
    <Text style={styles.sidebarIcon}>📦</Text>
    <Text style={styles.sidebarText}>Products List</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.sidebarItem}
    onPress={() => {
      toggleMenu();
      router.push('/dashboard');
    }}
  >
    <Text style={styles.sidebarIcon}>🧬</Text>
    <Text style={styles.sidebarText}>Categories Summary</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.sidebarItem}
    onPress={() => {
      toggleMenu();
      router.push('/login');
    }}
  >
    <Text style={styles.sidebarIcon}>⚙️</Text>
    <Text style={styles.sidebarText}>Personal Settings</Text>
  </TouchableOpacity>

</View>

<TouchableOpacity
  style={styles.logoutButton}
  onPress={() => {
    toggleMenu();
    router.push('/login');
  }}
>
  <Text style={styles.logoutText}>Log out</Text>
</TouchableOpacity>
</Animated.View>
     {/* ฉากหลังสีดำโปร่งแสงเมื่อเมนูเปิดออกมา เพื่อให้กดปิดเมนูได้ง่าย */}
     {isMenuOpen && (
<TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleMenu} />
     )}
 
     {/* ==================== 3. หน้าหลักแอป (Main Content) ==================== */}
     {/* Header ของแอป */}
<View style={styles.header}>
       {/* ผูกฟังก์ชัน toggleMenu เข้ากับปุ่ม 3 ขีดมุมบนซ้าย */}
<TouchableOpacity onPress={toggleMenu}>
<Ionicons name="menu" size={26} color="#FFF" />
</TouchableOpacity>
<Text style={styles.headerTitle}>VANTA</Text>
<TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
<Text style={styles.avatarText}>V</Text>
</TouchableOpacity>
</View>
<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
<Text style={styles.sectionTitle}>Recent activity</Text>
       {/* การ์ดตัวเลขจัดเรียงแถวละ 3 กล่อง */}
<View style={styles.statsGrid}>
<View style={styles.statCard}>
<Text style={styles.statNumber}>741</Text>
<Text style={styles.statSub}>Qty</Text>
<Text style={styles.statLabel}>NEW ITEMS</Text>
</View>
<View style={styles.statCard}>
<Text style={styles.statNumber}>123</Text>
<Text style={styles.statSub}>Qty</Text>
<Text style={styles.statLabel}>NEW ORDERS</Text>
</View>
<View style={styles.statCard}>
<Text style={styles.statNumber}>12</Text>
<Text style={styles.statSub}>Qty</Text>
<Text style={styles.statLabel}>REFUNDS</Text>
</View>
<View style={styles.statCard}>
<Text style={styles.statNumber}>1</Text>
<Text style={styles.statSub}>Qty</Text>
<Text style={styles.statLabel}>MESSAGE</Text>
</View>
<View style={styles.statCard}>
<Text style={styles.statNumber}>4</Text>
<Text style={styles.statSub}>Qty</Text>
<Text style={styles.statLabel}>GROUPS</Text>
</View>
<TouchableOpacity style={[styles.statCard, styles.viewMoreCard]} onPress={() => router.push('/dashboard')}>
<Ionicons name="arrow-forward-box" size={24} color="#FFF" style={styles.viewMoreIcon} />
<Text style={styles.viewMoreText}>VIEW MORE</Text>
</TouchableOpacity>
</View>
<Text style={styles.sectionTitle}>Sales Volume</Text>
<View style={styles.chartContainer}>
<View style={styles.chartRow}>
<View style={styles.barWrapper}>
<View style={[styles.bar, { height: '50%' }]} />
<Text style={styles.barLabel}>Confirmed</Text>
</View>
<View style={styles.barWrapper}>
<View style={[styles.bar, { height: '85%' }]} />
<Text style={styles.barLabel}>Pooled</Text>
</View>
<View style={styles.barWrapper}>
<View style={[styles.bar, { height: '35%' }]} />
<Text style={styles.barLabel}>Refunded</Text>
</View>
<View style={styles.barWrapper}>
<View style={[styles.bar, { height: '90%' }]} />
<Text style={styles.barLabel}>Shipped</Text>
</View>
</View>
</View>
</ScrollView>
 
     {/* ==================== 4. แถบเมนูด้านล่าง (Navigation Bar) ==================== */}
<View style={styles.navBar}>
       {/* ปุ่ม Home (หน้าปัจจุบัน) */}
<TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
<Ionicons name="home" size={22} color="#6366F1" />
<Text style={[styles.navText, { color: '#6366F1', fontWeight: 'bold' }]}>Home</Text>
</TouchableOpacity>
       {/* ปุ่ม Add สำหรับย้ายไปหน้าเพิ่มสินค้า */}
<TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
<Ionicons name="add" size={28} color="#9CA3AF" style={styles.addIcon} />
<Text style={styles.navText}>Add</Text>
</TouchableOpacity>
       {/* ปุ่ม Products สำหรับย้ายไปหน้ารายการสินค้า */}
<TouchableOpacity style={styles.navItem} onPress={() => router.push('/stock')}>
<MaterialCommunityIcons name="cube-outline" size={22} color="#9CA3AF" />
<Text style={styles.navText}>Products</Text>
</TouchableOpacity>
       {/* ปุ่ม Categories สำหรับย้ายไปหน้าหมวดหมู่ */}
<TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
<Ionicons name="git-network-outline" size={22} color="#9CA3AF" />
<Text style={styles.navText}>Categories</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
 );
}
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#E5E7EB', position: 'relative' },
 scrollContainer: { padding: 16, paddingBottom: 100 },
 // Header แถบบนสุด
 header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 16, paddingVertical: 14 },
 headerTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
 avatar: { backgroundColor: '#D1D5DB', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
 avatarText: { fontWeight: 'bold', color: '#111827' },
 sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginTop: 20, marginBottom: 12 },
 // รีเซ็ตสไตล์การ์ดเป็น แถวละ 3 กล่อง
 statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
 statCard: { backgroundColor: '#FFF', width: '31%', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
 statNumber: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
 statSub: { fontSize: 10, color: '#9CA3AF', marginVertical: 2 },
 statLabel: { fontSize: 9, fontWeight: 'bold', color: '#4B5563', textAlign: 'center' },
 viewMoreCard: { justifyContent: 'center', backgroundColor: '#FFF' },
 viewMoreIcon: { backgroundColor: '#2563EB', padding: 4, borderRadius: 6, overflow: 'hidden' },
 viewMoreText: { fontSize: 9, fontWeight: 'bold', color: '#2563EB', marginTop: 4 },
 // โซนกราฟแท่ง
 chartContainer: { backgroundColor: '#D9D9F3', borderRadius: 16, padding: 20, height: 200, justifyContent: 'flex-end' },
 chartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' },
 barWrapper: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
 bar: { backgroundColor: '#312E81', width: 22, borderRadius: 6 },
 barLabel: { fontSize: 10, color: '#4B5563', marginTop: 8, fontWeight: '500' },
 // แถบเมนูด้านล่าง
 navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#111827', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151', zIndex: 10 },
 navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
 navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
 addIcon: { backgroundColor: 'transparent' },
 // ==================== สไตล์สำหรับเมนูด้านข้าง (Sidebar) ====================
 sidebar: { position: 'absolute', top: 0, bottom: 0, width: '70%', backgroundColor: '#111827', padding: 20, zIndex: 100, shadowColor: '#000', shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 16 },
 sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
 sidebarLogo: { fontSize: 22, fontWeight: '900', color: '#FFF', letterSpacing: 3 },
 sidebarMenu: { marginTop: 20 },
 sidebarItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 10, borderRadius: 8, marginBottom: 8 },
 sidebarItemActive: { backgroundColor: '#1F2937' },
 sidebarIcon: { fontSize: 16, marginRight: 15 },
 sidebarText: { color: '#9CA3AF', fontSize: 15, fontWeight: '500' },
 sidebarTextActive: { color: '#FFF', fontSize: 15, fontWeight: '700' },
 logoutButton: { position: 'absolute', bottom: 30, left: 30 },
 logoutText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
 overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 90 }
});