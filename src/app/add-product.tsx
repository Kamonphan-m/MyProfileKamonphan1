import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editId) {
      loadProductForEdit();
    }
  }, [editId]);

  const loadProductForEdit = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@lumen_products');
      if (storedData) {
        const products = JSON.parse(storedData);
        const item = products.find((p: any) => p.id === editId);
        if (item) {
          setName(item.name);
          // เอาอักษรที่ไม่ใช่ตัวเลขออกทั้งหมด ก่อนเอามาแสดงใน Input แก้ไข
          setPrice(item.price.toString().replace(/[^\d]/g, ''));
          setStock(item.stock.toString().replace(/[^\d]/g, ''));
          setImageUrl(item.image || '');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('Missing Info', 'Please fill in all core configurations.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem('@lumen_products');
      let products = storedData ? JSON.parse(storedData) : [];

      // ดึงเฉพาะตัวเลขบริสุทธิ์เพื่อจัดเก็บลง Storage
      const cleanPrice = price.replace(/[^\d]/g, '');
      const cleanStock = stock.replace(/[^\d]/g, '');

      // ป้องกันเรื่อง blob url ค้างในระบบ
      let finalImg = imageUrl.trim();
      if (finalImg.startsWith('blob:')) {
        finalImg = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop';
      }

      if (editId) {
        // ทำการอัปเดตตัวเก่า
        products = products.map((p: any) => 
          p.id === editId 
            ? { ...p, name, price: cleanPrice, stock: cleanStock, image: finalImg } 
            : p
        );
      } else {
        // เพิ่มตัวใหม่
        const newProd = {
          id: Date.now().toString(),
          name,
          price: cleanPrice,
          stock: cleanStock,
          image: finalImg || 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop'
        };
        products.push(newProd);
      }

      await AsyncStorage.setItem('@lumen_products', JSON.stringify(products));
      
      Alert.alert('Successful', 'Matrix array database has been updated.', [
        { 
          text: 'OK', 
          onPress: () => {
            // บังคับเปลี่ยนหน้าและล้าง stack เพื่อให้หน้า stock โหลดใหม่ทันที
            router.replace('/stock');
          } 
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update matrix data.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editId ? 'UPDATE CONFIGURATION' : 'REGISTER TERMINAL'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.label}>PRODUCT NAME</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Model Name" placeholderTextColor="#4B5563" />

          <Text style={styles.label}>UNIT PRICE (THB)</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g. 5990" placeholderTextColor="#4B5563" />

          <Text style={styles.label}>STOCK QUANTITY</Text>
          <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" placeholder="e.g. 15" placeholderTextColor="#4B5563" />

          <Text style={styles.label}>IMAGE URL LINK</Text>
          <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="Paste public image link (https://...)" placeholderTextColor="#4B5563" autoCapitalize="none" autoCorrect={false} />
          <Text style={styles.hint}>* รูปภาพต้องเริ่มต้นด้วย https:// ห้ามขึ้นต้นด้วย blob: เพื่อให้แสดงผลได้อย่างถูกต้อง</Text>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitText}>{editId ? 'APPLY CONFIGURATION CHANGES' : 'CREATE MATRIX'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1F2937' },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  scrollContainer: { padding: 20 },
  formCard: { backgroundColor: '#151F32', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#1E293B' },
  label: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 },
  input: { backgroundColor: '#1E293B', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#FFF', fontSize: 14, marginBottom: 20, borderWidth: 1, borderColor: '#2D3748' },
  hint: { fontSize: 10, color: '#6B7280', marginTop: -10, marginBottom: 10 },
  submitBtn: { backgroundColor: '#6366F1', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  submitText: { color: '#FFF', fontSize: 12, fontWeight: '800', letterSpacing: 1 }
});