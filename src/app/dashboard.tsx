import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function DashboardScreen() {
 const router = useRouter();
 return (
<SafeAreaView style={styles.container}>
     {/* 1. Header สไตล์ VANTA */}
<View style={styles.header}>
<TouchableOpacity>
<Ionicons name="menu" size={26} color="#FFF" />
</TouchableOpacity>
<Text style={styles.headerTitle}>VANTA</Text>
<View style={styles.avatar}>
<Text style={styles.avatarText}>V</Text>
</View>
</View>
<ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
       {/* หัวข้อส่วนกิจกรรม */}
<Text style={styles.sectionTitle}>Recent activity</Text>
       {/* 2. การ์ดตัวเลข จัดเรียงแถวละ 3 กล่องแบบรูปที่ 2 */}
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
<View style={[styles.statCard, styles.viewMoreCard]}>
<Ionicons name="arrow-forward-box" size={24} color="#FFF" style={styles.viewMoreIcon} />
<Text style={styles.viewMoreText}>VIEW MORE</Text>
</View>
</View>
       {/* 3. โซนกราฟแท่ง Sales Volume */}
<Text style={styles.sectionTitle}>Sales Volume</Text>
<View style={styles.chartContainer}>
<View style={styles.chartRow}>
           {/* แท่งกราฟแต่ละแท่ง */}
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
     {/* 4. แถบเมนูด้านล่าง (Navigation Bar) ที่กดเครื่องหมายบวก (+) แล้วเปิดหน้าเพิ่มสินค้าได้จริง */}
<View style={styles.navBar}>
<TouchableOpacity style={styles.navItem}>
<Ionicons name="home" size={22} color="#9CA3AF" />
<Text style={[styles.navText, { color: '#9CA3AF' }]}>Home</Text>
</TouchableOpacity>
       {/* ปุ่มเครื่องหมายบวก ผูกคำสั่งย้ายหน้าตรงนี้ค่ะ! */}
<TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
<Ionicons name="add" size={28} color="#6366F1" style={styles.addIconActive} />
<Text style={[styles.navText, { color: '#6366F1', fontWeight: 'bold' }]}>Add</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.navItem}>
<MaterialCommunityIcons name="cube-outline" size={22} color="#9CA3AF" />
<Text style={styles.navText}>Products</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.navItem}>
<Ionicons name="git-network-outline" size={22} color="#9CA3AF" />
<Text style={styles.navText}>Categories</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
 );
}
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#E5E7EB' },
 scrollContainer: { padding: 16, paddingBottom: 100 },
 // Header
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
 // โซนกราฟแท่ง Sales Volume
 chartContainer: { backgroundColor: '#D9D9F3', borderRadius: 16, padding: 20, height: 200, justifyContent: 'flex-end' },
 chartRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' },
 barWrapper: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
 bar: { backgroundColor: '#312E81', width: 22, borderRadius: 6 },
 barLabel: { fontSize: 10, color: '#4B5563', marginTop: 8, fontWeight: '500' },
 // แถบเมนูด้านล่าง
 navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#111827', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#374151' },
 navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
 navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
 addIconActive: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 6 },
});