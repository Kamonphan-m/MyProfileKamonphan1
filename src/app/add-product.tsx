import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddProductScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams(); // รับไอดีของตัวที่จะแก้ไขมา

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 🛠️ ถ้ามี editId ส่งมา ให้ไปดึงข้อมูลเก่ามาเติมใน Input ค้างไว้ให้อัตโนมัติ
  useEffect(() => {
    if (editId) {
      const loadProductToEdit = async () => {
        try {
          const savedData = await AsyncStorage.getItem('@vanta_products');
          if (savedData) {
            const products = JSON.parse(savedData);
            const target = products.find((p: any) => p.id === editId);
            if (target) {
              // ล้างคำว่า "บ." ออกจากราคาก่อนนำมาใส่ช่องกรอกข้อมูล
              const cleanPrice = target.price.toString().replace(/[^\d.]/g, '');
              
              setName(target.name);
              setPrice(cleanPrice);
              setStock(target.stock.toString());
              setImageUri(target.image);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadProductToEdit();
    }
  }, [editId]);

  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name || !price || !stock) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const existingProducts = await AsyncStorage.getItem('@vanta_products');
      let products = existingProducts ? JSON.parse(existingProducts) : [];

      const stockNum = parseInt(stock, 10) || 0;
      const formattedPrice = price.includes('บ.') ? price : `${Number(price).toLocaleString()} บ.`;

      if (editId) {
        // 🛠️ กรณี "แก้ไขสินค้าเดิม": ทำการ Map แทนที่ตัวเก่าตัวเดิมที่มีไอดีตรงกัน
        products = products.map((prod: any) => {
          if (prod.id === editId) {
            return {
              ...prod,
              name: brand ? `${brand} ${name}` : name,
              price: formattedPrice,
              stock: stockNum,
              image: imageUri || '',
            };
          }
          return prod;
        });
      } else {
        // กรณี "เพิ่มสินค้าชิ้นใหม่": นำข้อมูลต่อไปท้ายสุด
        const newProduct = {
          id: Date.now().toString(),
          name: brand ? `${brand} ${name}` : name,
          price: formattedPrice,
          stock: stockNum,
          image: imageUri || '',
        };
        products.push(newProduct);
      }

      await AsyncStorage.setItem('@vanta_products', JSON.stringify(products));
      router.push('/stock');
      
    } catch (error) {
      Alert.alert("Error", "Failed to save product data.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        {/* ปรับหัวข้อตามสถานะการทำงาน */}
        <Text style={styles.headerTitle}>{editId ? 'Edit Projector' : 'Add New Projector'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Projector Image</Text>
        <TouchableOpacity style={styles.imageUploadBox} onPress={handleSelectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
              <Text style={styles.uploadText}>Click to upload image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Projector Model / Full Name</Text>
        <TextInput style={styles.input} placeholder="e.g., Epson EB-X06 4K" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />

        {/* ปิดช่องแบรนด์ไว้กรณีแก้ไข เพราะชื่อแบรนด์จะรวมอยู่ใน Model Name เรียบร้อยแล้ว */}
        {!editId && (
          <>
            <Text style={styles.label}>Brand</Text>
            <TextInput style={styles.input} placeholder="e.g., WANBO, EPSON" placeholderTextColor="#9CA3AF" value={brand} onChangeText={setBrand} />
          </>
        )}

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Price</Text>
            <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" placeholderTextColor="#9CA3AF" value={price} onChangeText={setPrice} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput style={styles.input} placeholder="0" keyboardType="numeric" placeholderTextColor="#9CA3AF" value={stock} onChangeText={setStock} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{editId ? 'Update Product' : 'Save Product'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#374151' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  backButton: { padding: 5 },
  form: { backgroundColor: '#FFF', padding: 20, margin: 15, borderRadius: 20, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginTop: 14, marginBottom: 6 },
  input: { backgroundColor: '#F9FAFB', padding: 14, borderRadius: 10, fontSize: 14, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB' },
  row: { flexDirection: 'row' },
  imageUploadBox: { backgroundColor: '#F9FAFB', height: 120, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DB', overflow: 'hidden' },
  uploadPlaceholder: { alignItems: 'center' },
  uploadText: { color: '#9CA3AF', marginTop: 5, fontSize: 12 },
  uploadedImage: { width: '100%', height: '100%' },
  saveButton: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});