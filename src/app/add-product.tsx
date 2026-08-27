import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { createProduct, getProduct, ProductInput, updateProduct } from '@/lib/products-api';
 
export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editId = params.editId as string | undefined;
 
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    if (editId) {
      loadProductForEdit();
    }
  }, [editId]);
 
  const loadProductForEdit = async () => {
    try {
      const item = await getProduct(editId!);
      setName(item.name || '');
      setPrice(String(item.price ?? ''));
      setStock(String(item.stock ?? ''));
      setImageUrl(item.image || '');
    } catch (error) {
      showAlert('ไม่สามารถโหลดสินค้าได้', error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
    }
  };
 
  const showAlert = (title: string, message: string, onPressOk?: () => void) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onPressOk) onPressOk();
    } else {
      Alert.alert(title, message, [{ text: 'OK', onPress: onPressOk }]);
    }
  };
 
  const handleSave = async () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      showAlert('Missing Info', 'Please fill in all core configurations.');
      return;
    }
 
    setLoading(true);
 
    const cleanPrice = Number(price.replace(/[^\d]/g, ''));
    const cleanStock = Number(stock.replace(/[^\d]/g, ''));
 
    let finalImg = imageUrl.trim();
    if (!finalImg || finalImg.startsWith('blob:')) {
      finalImg = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop';
    }
 
    const payload: ProductInput = {
      name: name.trim(),
      price: cleanPrice,
      stock: cleanStock,
      category: 'Projector',
      status: 'Active',
      image: finalImg
    };
 
    try {
      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      showAlert('Successful', 'Projector database has been updated.', () => {
        router.replace('/stock');
      });
    } catch (error) {
      showAlert('ไม่สามารถบันทึกสินค้าได้', error instanceof Error ? error.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#4A3525" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editId ? 'EDIT PROJECTOR' : 'ADD NEW PROJECTOR'}</Text>
        <View style={{ width: 40 }} />
      </View>
 
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.label}>PROJECTOR MODEL / NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. WANBO X2 Max Smart Projector"
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
          <Text style={styles.hint}>* ลิงก์รูปภาพควรเริ่มต้นด้วย https:// เพื่อความถูกต้องในการแสดงผล</Text>
        </View>
 
        {/* ปุ่มบันทึก */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>{editId ? 'SAVE CHANGES' : 'SAVE PROJECTOR'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F4F0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9E2'
  },
  headerTitle: { fontSize: 13, fontWeight: '800', color: '#3E2723', letterSpacing: 1 },
  navBtn: { backgroundColor: '#F5F2EC', padding: 8, borderRadius: 12 },
 
  scrollContainer: { padding: 20 },
 
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDE9E2'
  },
  label: { fontSize: 11, fontWeight: '800', color: '#8A7A71', marginBottom: 8, letterSpacing: 0.5 },
 
  input: {
    backgroundColor: '#F9F8F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#3E2723',
    fontSize: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EDE9E2'
  },
  hint: { fontSize: 10, color: '#A19288', marginTop: -10, marginBottom: 10, lineHeight: 14 },
 
  submitBtn: {
    backgroundColor: '#4A3525',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4A3525',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  submitText: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 }
});
