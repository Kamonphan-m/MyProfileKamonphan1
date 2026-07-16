import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 1. นำเข้า AsyncStorage เพื่อใช้บันทึกข้อมูลถาวร
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProductScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

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

  // 🛠️ ปรับฟังก์ชันเซฟใหม่: บันทึกลงเครื่องแบบถาวรก่อนย้ายหน้า
  const handleSave = async () => {
    if (!name || !brand || !price || !stock) {
      Alert.alert("Error", "Please fill in all fields (including Price and Stock)");
      return;
    }

    // สร้างออบเจกต์ข้อมูลสินค้าชิ้นใหม่
    const newProduct = {
      id: Date.now().toString(), // ใช้ timestamp ทำเป็น ID ของสินค้า
      name: `${brand} ${name}`,  // รวมแบรนด์กับชื่อโมเดลเหมือนหน้าคลังสินค้า
      price: price,
      stock: stock,
      image: imageUri || '',     // เซฟ path รูปภาพไว้
    };

    try {
      // 1. ดึงรายการสินค้าเดิมที่เคยเซฟไว้ในเครื่องออกมาก่อน
      const existingProducts = await AsyncStorage.getItem('@vanta_products');
      const products = existingProducts ? JSON.parse(existingProducts) : [];

      // 2. นำสินค้าชิ้นใหม่ต่อท้ายเข้าไปในอาเรย์
      products.push(newProduct);

      // 3. บันทึกอาเรย์ชุดใหม่กลับลงเครื่องแบบถาวร (แปลงเป็นสตริงก่อนเซฟ)
      await AsyncStorage.setItem('@vanta_products', JSON.stringify(products));

      // 4. เมื่อเซฟลงเครื่องสำเร็จ ค่อยย้ายหน้ากลับไปที่หน้า /stock
      // ไม่ต้องส่ง params พ่วงไปให้หนักเครื่องแล้ว เพราะข้อมูลอยู่ในหน่วยความจำหลักแล้วค่ะ
      router.push('/stock');
      
    } catch (error) {
      Alert.alert("Error", "Failed to save product data.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header สไตล์ VANTA */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Projector</Text>
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

        <Text style={styles.label}>Projector Model Name</Text>
        <TextInput style={styles.input} placeholder="e.g., X2 Max Smart Android" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />

        <Text style={styles.label}>Brand</Text>
        <TextInput style={styles.input} placeholder="e.g., WANBO, EPSON" placeholderTextColor="#9CA3AF" value={brand} onChangeText={setBrand} />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Price (THB/USD)</Text>
            <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" placeholderTextColor="#9CA3AF" value={price} onChangeText={setPrice} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput style={styles.input} placeholder="0" keyboardType="numeric" placeholderTextColor="#9CA3AF" value={stock} onChangeText={setStock} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Product</Text>
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