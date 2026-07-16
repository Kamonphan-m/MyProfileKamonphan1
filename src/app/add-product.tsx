import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// โครงสร้างข้อมูลตั้งต้นของสินค้าชิ้นหลัก (เหมือนกับหน้า stock เพื่อความเสถียร)
const INITIAL_PROJECTOR_DATA = [
  { id: '1', name: 'WANBO X2 Max Smart Android Projector', price: '5990', stock: '15', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '2', name: 'WANBO Mini Projector', price: '3502', stock: '10', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '3', name: 'WANBO Projector Android 9.0 / Mozart', price: '17590', stock: '15', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'ACER Projector x 1328wi', price: '17390', stock: '15', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
  { id: '5', name: 'Epson Projector / EB-E24', price: '17790', stock: '25', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop' },
];

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined; // รับ id จากปุ่มเฟือง

  // States สำหรับเก็บค่าใน Input ฟอร์ม
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // โหลดข้อมูลเก่ามาใส่ฟอร์มกรณีที่เป็นการ "แก้ไขสินค้า" (Edit Mode)
  useEffect(() => {
    if (editId) {
      loadProductForEdit();
    }
  }, [editId]);

  const loadProductForEdit = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@vanta_products');
      let products = storedData ? JSON.parse(storedData) : INITIAL_PROJECTOR_DATA;
      
      const targetItem = products.find((item: any) => item.id === editId);
      if (targetItem) {
        setName(targetItem.name);
        setPrice(targetItem.price.toString());
        setStock(targetItem.stock.toString());
        setImageUrl(targetItem.image || '');
      }
    } catch (error) {
      console.error('Failed to load product for editing', error);
    }
  };

  // Function บันทึกข้อมูล (รองรับทั้งเพิ่มใหม่ และแก้ไขตัวเก่า)
  const handleSaveProduct = async () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('System Alert', 'Please complete all required core parameters.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('@vanta_products');
      let products = storedData ? JSON.parse(storedData) : [...INITIAL_PROJECTOR_DATA];

      if (editId) {
        // 🔄 LOGIC แก้ไข: อัปเดตทับข้อมูลตัวเดิมใน Array
        products = products.map((item: any) => 
          item.id === editId 
            ? { ...item, name, price, stock, image: imageUrl.trim() } 
            : item
        );
      } else {
        // ➕ LOGIC เพิ่มใหม่: สร้าง Object ชิ้นใหม่ต่อท้าย
        const newProduct = {
          id: Date.now().toString(),
          name,
          price,
          stock,
          image: imageUrl.trim(),
        };
        products.push(newProduct);
      }

      // บันทึกลงหน่วยความจำถาวรเครื่อง
      await AsyncStorage.setItem('@vanta_products', JSON.stringify(products));
      
      Alert.alert(
        'Success', 
        editId ? 'Terminal configuration updated successfully.' : 'New hardware terminal registered.',
        [{ text: 'OK', onPress: () => router.push('/stock') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save configuration matrix data.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ⚡ Header สไตล์ LUMEN.OS */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editId ? 'UPDATE TERMINAL' : 'REGISTER TERMINAL'}</Text>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
          <Text style={styles.avatarText}>AD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Hardware System Input</Text>
        
        <View style={styles.formCard}>
          {/* Input 1: ชื่อสินค้า */}
          <Text style={styles.inputLabel}>PRODUCT NAME / MODEL</Text>
          <TextInput
            style={styles.inputField}
            placeholder="e.g., WANBO X2 Max Smart"
            placeholderTextColor="#4B5563"
            value={name}
            onChangeText={setName}
          />

          {/* Input 2: ราคา */}
          <Text style={styles.inputLabel}>UNIT PRICE (THB)</Text>
          <TextInput
            style={styles.inputField}
            placeholder="e.g., 5990"
            placeholderTextColor="#4B5563"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Input 3: จำนวนคลัง */}
          <Text style={styles.inputLabel}>STOCK QUANTITY (UNITS)</Text>
          <TextInput
            style={styles.inputField}
            placeholder="e.g., 15"
            placeholderTextColor="#4B5563"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
          />

          {/* 🖼️ Input 4: ฟิลด์เปลี่ยนรูปภาพสินค้าด้วย Web URL */}
          <Text style={styles.inputLabel}>PRODUCT IMAGE URL</Text>
          <TextInput
            style={[styles.inputField, styles.urlInput]}
            placeholder="Paste web link here (e.g., https://...)"
            placeholderTextColor="#4B5563"
            autoCapitalize="none"
            autoCorrect={false}
            value={imageUrl}
            onChangeText={setImageUrl}
          />
          <Text style={styles.inputHint}>* Paste image URL web link (.jpg, .png) to change the thumbnail appearance.</Text>
        </View>

        {/* ปุ่ม Submit หลัก */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSaveProduct}>
          <Ionicons name={editId ? "save-outline" : "add-circle-outline"} size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitBtnText}>
            {editId ? 'APPLY CONFIGURATION CHANGES' : 'DEPLOY TO WAREHOUSE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🗺️ Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle" size={20} color="#6366F1" />
          <Text style={[styles.navText, { color: '#6366F1', fontWeight: 'bold' }]}>Add</Text>
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
  scrollContainer: { padding: 20, paddingBottom: 120 },
  
  // Header Style
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  avatar: { backgroundColor: '#6366F1', width: 35, height: 35, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 12 },
  
  // Content Layout
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#6366F1', marginTop: 10, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1.5 },
  formCard: { backgroundColor: '#151F32', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#1E293B' },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 },
  inputField: { backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#FFF', fontSize: 14, marginBottom: 20, borderWidth: 1, borderColor: '#2D3748', fontWeight: '500' },
  urlInput: { fontFamily: 'Platform' === 'ios' ? 'Courier' : 'sans-serif-light', fontSize: 12 },
  inputHint: { fontSize: 10, color: '#6B7280', marginTop: -12, marginBottom: 10, fontWeight: '500' },

  // Submit Action Button
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6366F1', paddingVertical: 16, borderRadius: 14, marginTop: 24, shadowColor: '#6366F1', shadowOpacity: 0.2, shadowRadius: 10, elevation: 3 },
  submitBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800', letterSpacing: 1 },

  // Bottom Navigation NavBar
  navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 70, backgroundColor: '#111827', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1F2937', zIndex: 10 },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: '600' }
});