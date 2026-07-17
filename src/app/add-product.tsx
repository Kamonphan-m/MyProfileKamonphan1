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

      const cleanPrice = price.replace(/[^\d]/g, '');
      const cleanStock = stock.replace(/[^\d]/g, '');

      let finalImg = imageUrl.trim();
      if (finalImg.startsWith('blob:')) {
        finalImg = 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop';
      }

      if (editId) {
        products = products.map((p: any) => 
          p.id === editId 
            ? { ...p, name, price: cleanPrice, stock: cleanStock, image: finalImg } 
            : p
        );
      } else {
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
      
      Alert.alert('Successful', 'Product database has been updated.', [
        { 
          text: 'OK', 
          onPress: () => {
            router.replace('/stock');
          } 
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update data.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ส่วนหัวดีไซน์มินิมอลละมุน */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#4A3525" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editId ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* การ์ดกรอกข้อมูลสีขาวมนโค้งน่ารักพร้อมเงาละมุน */}
        <View style={styles.formCard}>
          <Text style={styles.label}>PRODUCT NAME</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Model / Brand Name" 
            placeholderTextColor="#A19288" 
          />

          <Text style={styles.label}>UNIT PRICE (THB)</Text>
          <TextInput 
            style={styles.input} 
            value={price} 
            onChangeText={setPrice} 
            keyboardType="numeric" 
            placeholder="e.g. 5990" 
            placeholderTextColor="#A19288" 
          />

          <Text style={styles.label}>STOCK QUANTITY</Text>
          <TextInput 
            style={styles.input} 
            value={stock} 
            onChangeText={setStock} 
            keyboardType="numeric" 
            placeholder="e.g. 15" 
            placeholderTextColor="#A19288" 
          />

          <Text style={styles.label}>IMAGE URL LINK</Text>
          <TextInput 
            style={styles.input} 
            value={imageUrl} 
            onChangeText={setImageUrl} 
            placeholder="https://example.com/image.jpg" 
            placeholderTextColor="#A19288" 
            autoCapitalize="none" 
            autoCorrect={false} 
          />
          <Text style={styles.hint}>* รูปภาพต้องเริ่มต้นด้วย https:// ห้ามขึ้นต้นด้วย blob: เพื่อความถูกต้อง</Text>
        </View>

        {/* ปุ่มบันทึกสไตล์น้ำตาลหรู */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitText}>{editId ? 'SAVE CHANGES' : 'SAVE PRODUCT'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // พื้นหลังสีครีมนวลอบอุ่น สไตล์ Cozy มินิมอล
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#EDE9E2' },
  headerTitle: { fontSize: 14, fontWeight: '800', color: '#3E2723', letterSpacing: 1 },
  navBtn: { backgroundColor: '#F5F2EC', padding: 8, borderRadius: 12 },
  
  scrollContainer: { padding: 20 },
  
  // การ์ดกรอกฟอร์มสีขาว มนโค้ง ละมุนตา
  formCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, shadowColor: '#3E2723', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  label: { fontSize: 11, fontWeight: '800', color: '#8A7A71', marginBottom: 8, letterSpacing: 0.5 },
  
  // ช่อง TextInput โทนสีครีมคลีนๆ สบายตา
  input: { backgroundColor: '#F9F8F6', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#3E2723', fontSize: 14, marginBottom: 22, borderWidth: 1, borderColor: '#EDE9E2' },
  hint: { fontSize: 10, color: '#A19288', marginTop: -12, marginBottom: 12, lineHeight: 14 },
  
  // ปุ่มกดสีน้ำตาลเข้มหรูหรา
  submitBtn: { backgroundColor: '#4A3525', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20, shadowColor: '#4A3525', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  submitText: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 }
});