import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
export default function AddProductScreen() {
 const router = useRouter();
 const [name, setName] = useState('');
 const [brand, setBrand] = useState('');
 const [price, setPrice] = useState('');
 const [stock, setStock] = useState('');
 const handleSave = () => {
   Alert.alert("สำเร็จ", "บันทึกข้อมูลเครื่องโปรเจคเตอร์เรียบร้อยแล้ว");
   router.back(); // กลับไปหน้าก่อนหน้า
 };
 return (
<SafeAreaView style={styles.container}>
<View style={styles.header}>
<TouchableOpacity onPress={() => router.back()}>
<Ionicons name="arrow-back" size={24} color="#1E1B4B" />
</TouchableOpacity>
<Text style={styles.headerTitle}>เพิ่มเครื่องโปรเจคเตอร์</Text>
<View style={{ width: 24 }} />
</View>
<View style={styles.form}>
<Text style={styles.label}>ชื่อรุ่นโปรเจคเตอร์</Text>
<TextInput style={styles.input} placeholder="เช่น Projector 4K Ultra HD" value={name} onChangeText={setName} />
<Text style={styles.label}>แบรนด์</Text>
<TextInput style={styles.input} placeholder="เช่น Epson, BenQ, Acer" value={brand} onChangeText={brand} />
<Text style={styles.label}>ราคา (บาท)</Text>
<TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" value={price} onChangeText={setPrice} />
<Text style={styles.label}>จำนวนในสต็อก</Text>
<TextInput style={styles.input} placeholder="0" keyboardType="numeric" value={stock} onChangeText={setStock} />
<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
<Text style={styles.saveButtonText}>บันทึกสินค้า</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
 );
}
const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
 header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
 headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E1B4B' },
 form: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginTop: 10 },
 label: { fontSize: 14, fontWeight: '600', color: '#1E1B4B', marginBottom: 6, marginTop: 12 },
 input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: 16 },
 saveButton: { backgroundColor: '#1E1B4B', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30 },
 saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});