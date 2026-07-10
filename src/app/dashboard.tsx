import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. นำเข้า useRouter
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function DashboardScreen() {
 const router = useRouter(); // 2. เรียกใช้งาน router
 return (
<SafeAreaView style={styles.safeArea}>
<ScrollView style={styles.container}>
       {/* HEADER */}
<View style={styles.header}>
<View>
<Text style={styles.headerTitle}>Inventor.io</Text>
<Text style={styles.subTitle}>Home dashboard (Projector Store)</Text>
</View>
<TouchableOpacity style={styles.profileCircle}>
<Ionicons name="person" size={20} color="#fff" />
</TouchableOpacity>
</View>
       {/* RECENT ACTIVITY */}
<Text style={styles.sectionTitle}>Recent activity</Text>
<View style={styles.row}>
<ActivityCard number="241" label="NEW ITEMS" />
<ActivityCard number="125" label="NEW ORDERS" />
<ActivityCard number="12" label="REFUNDS" />
<ActivityCard number="4" label="GROUPS" />
</View>
       {/* SALES CHART */}
<Text style={styles.sectionTitle}>Sales</Text>
<View style={styles.chartCard}>
<View style={styles.chartContainer}>
<View style={[styles.bar, { height: '40%' }]} />
<View style={[styles.bar, { height: '80%' }]} />
<View style={[styles.bar, { height: '60%' }]} />
<View style={[styles.bar, { height: '100%' }]} />
<View style={[styles.bar, { height: '50%' }]} />
</View>
<View style={styles.chartDivider} />
<View style={styles.chartLegend}>
<Text style={styles.legendText}>Confirmed</Text>
<Text style={styles.legendText}>Packed</Text>
<Text style={styles.legendText}>Refunded</Text>
<Text style={styles.legendText}>Shipped</Text>
</View>
</View>
       {/* TOP ITEM CATEGORIES */}
<Text style={styles.sectionTitle}>Top item categories</Text>
<View style={styles.row}>
<CategoryIcon icon="videocam" color="#4F46E5" /> {/* เปลี่ยนเป็นไอคอนกล้อง/โปรเจคเตอร์ */}
<CategoryIcon icon="tv" color="#1E1B4B" />
<CategoryIcon icon="hardware-handle" color="#4F46E5" />
<CategoryIcon icon="cable" color="#1E1B4B" />
<CategoryIcon icon="ellipsis-horizontal" color="#9CA3AF" />
</View>
       {/* 3. ผูกปุ่มเมนูให้กดไปหน้าคลังสินค้า (Stock) */}
<View style={styles.tableCard}>
<Text style={styles.tableTitle}>ระบบจัดการสินค้า</Text>
<TouchableOpacity onPress={() => router.push('/stock')}>
<TableRow label="📦 ดูสต็อกสินค้าโปรเจคเตอร์" value="12 รุ่น" />
</TouchableOpacity>
<TableRow label="Item categories" value="6" />
<TableRow label="Refunded items" value="1" />
</View>
<View style={{ height: 100 }} />
</ScrollView>
     {/* BOTTOM NAVIGATION BAR */}
<View style={styles.bottomNav}>
<TouchableOpacity onPress={() => router.replace('/dashboard')}>
<Ionicons name="home" size={24} color="#4F46E5" />
</TouchableOpacity>
       {/* 4. ผูกปุ่มเครื่องหมายบวกตรงกลาง ให้กดเปิดหน้าเพิ่มสินค้า (Add Product) */}
<TouchableOpacity onPress={() => router.push('/add-product')}>
<Ionicons name="add-circle" size={36} color="#1E1B4B" />
</TouchableOpacity>
<TouchableOpacity onPress={() => router.push('/stock')}>
<Ionicons name="cube-outline" size={24} color="#9CA3AF" />
</TouchableOpacity>
<Ionicons name="person-outline" size={24} color="#9CA3AF" />
</View>
</SafeAreaView>
 );
}
// --- SUB-COMPONENTS เหมือนเดิม ---
const ActivityCard = ({ number, label }: { number: string, label: string }) => (
<View style={styles.miniCard}>
<Text style={styles.miniCardNumber}>{number}</Text>
<Text style={styles.miniCardLabel}>{label}</Text>
</View>
);
const CategoryIcon = ({ icon, color }: { icon: any, color: string }) => (
<View style={styles.categoryIconContainer}>
<Ionicons name={icon} size={24} color={color} />
</View>
);
const TableRow = ({ label, value }: { label: string, value?: string }) => (
<View style={styles.tableRow}>
<Text style={styles.tableLabel}>{label}</Text>
   {value && <Text style={styles.tableValue}>{value}</Text>}
<Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
</View>
);
const styles = StyleSheet.create({
 safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
 container: { flex: 1, padding: 20 },
 header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 10 },
 headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1E1B4B' },
 subTitle: { fontSize: 14, color: '#6B7280' },
 profileCircle: { backgroundColor: '#1E1B4B', padding: 8, borderRadius: 20 },
 sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E1B4B', marginVertical: 12 },
 row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
 miniCard: { backgroundColor: '#fff', flex: 1, marginHorizontal: 4, paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
 miniCardNumber: { fontSize: 18, fontWeight: 'bold', color: '#1E1B4B' },
 miniCardLabel: { fontSize: 8, color: '#9CA3AF', marginTop: 4 },
 chartCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, height: 180 },
 chartContainer: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' },
 bar: { width: 12, backgroundColor: '#4F46E5', borderRadius: 10 },
 chartDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 10 },
 chartLegend: { flexDirection: 'row', justifyContent: 'space-between' },
 legendText: { fontSize: 8, color: '#9CA3AF' },
 categoryIconContainer: { backgroundColor: '#E0E7FF', padding: 12, borderRadius: 12, width: 55, height: 55, alignItems: 'center', justifyContent: 'center' },
 tableCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginTop: 15 },
 tableTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E1B4B', marginBottom: 10 },
 tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#F3F4F6', alignItems: 'center' },
 tableLabel: { fontSize: 13, color: '#4B5563' },
 tableValue: { fontSize: 13, fontWeight: 'bold', color: '#1E1B4B' },
 bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: 10 }
});