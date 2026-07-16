import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400&auto=format&fit=crop';

const STORAGE_KEY = '@vanta_products';
const LEGACY_STORAGE_KEY = '@lumen_products';

const INITIAL_PROJECTOR_DATA = [
  {
    id: '1',
    name: 'WANBO X2 Max Smart Android Projector',
    price: '5,990 บ.',
    stock: 15,
    image: FALLBACK_IMAGE,
  },
  {
    id: '2',
    name: 'WANBO Mini Projector',
    price: '3,502 บ.',
    stock: 10,
    image: FALLBACK_IMAGE,
  },
  {
    id: '3',
    name: 'WANBO Projector Android 9.0 / Mozart',
    price: '17,590 บ.',
    stock: 15,
    image: FALLBACK_IMAGE,
  },
  {
    id: '4',
    name: 'ACER Projector x 1328wi',
    price: '17,390 บ.',
    stock: 15,
    image: FALLBACK_IMAGE,
  },
  {
    id: '5',
    name: 'Epson Projector / EB-E24',
    price: '17,790 บ.',
    stock: 25,
    image: FALLBACK_IMAGE,
  },
];

type Product = {
  id: string;
  name: string;
  price: string;
  stock: number;
  image: string;
};

async function loadProducts(): Promise<Product[]> {
  let savedData = await AsyncStorage.getItem(STORAGE_KEY);

  if (savedData === null) {
    const legacyData = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyData !== null) {
      savedData = legacyData;
      await AsyncStorage.setItem(STORAGE_KEY, legacyData);
    }
  }

  if (savedData !== null) {
    return JSON.parse(savedData);
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTOR_DATA));
  return INITIAL_PROJECTOR_DATA;
}

function stripPriceSuffix(price: string): string {
  return price.replace(/\s*บ\.?\s*$/, '').trim();
}

function formatPrice(price: string): string {
  const cleaned = stripPriceSuffix(price);
  if (!cleaned) return '';
  if (cleaned.includes('บ.')) return cleaned;
  const numeric = Number(cleaned.replace(/,/g, ''));
  if (Number.isNaN(numeric)) return cleaned;
  return `${numeric.toLocaleString()} บ.`;
}

export default function AddProductScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    const loadEditData = async () => {
      if (!editId) {
        setIsEditing(false);
        setName('');
        setPrice('');
        setStock('');
        setImageUrl('');
        return;
      }

      try {
        const products = await loadProducts();
        const product = products.find((item) => item.id === editId);

        if (product) {
          setIsEditing(true);
          setName(product.name);
          setPrice(stripPriceSuffix(product.price.toString()));
          setStock(product.stock.toString());
          setImageUrl(product.image || '');
          setPreviewError(false);
        } else {
          Alert.alert('Not Found', 'Product record could not be located.');
          router.replace('/stock');
        }
      } catch (error) {
        console.error('Failed to load product for editing:', error);
        Alert.alert('Load Error', 'Unable to retrieve product data.');
      }
    };

    loadEditData();
  }, [editId, router]);

  const previewUri =
    imageUrl.trim() !== '' && !previewError ? imageUrl.trim() : FALLBACK_IMAGE;

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedPrice = price.trim();
    const trimmedImage = imageUrl.trim();
    const stockValue = parseInt(stock, 10);

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Product name is required.');
      return;
    }
    if (!trimmedPrice) {
      Alert.alert('Validation Error', 'Product price is required.');
      return;
    }
    if (Number.isNaN(stockValue) || stockValue < 0) {
      Alert.alert('Validation Error', 'Stock must be a valid non-negative number.');
      return;
    }

    setIsSaving(true);

    try {
      const products = await loadProducts();
      const formattedPrice = formatPrice(trimmedPrice);
      const imageToSave = trimmedImage || FALLBACK_IMAGE;

      let updatedProducts: Product[];

      if (isEditing && editId) {
        updatedProducts = products.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: trimmedName,
                price: formattedPrice,
                stock: stockValue,
                image: imageToSave,
              }
            : item
        );
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          name: trimmedName,
          price: formattedPrice,
          stock: stockValue,
          image: imageToSave,
        };
        updatedProducts = [...products, newProduct];
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      router.replace('/stock');
    } catch (error) {
      console.error('Failed to save product:', error);
      Alert.alert('Save Error', 'Unable to persist product data.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/stock')} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'UPDATE PROJECTOR' : 'INSERT PROJECTOR'}
        </Text>
        <View style={styles.navBtnPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionLabel}>Product Image Preview</Text>
          <View style={styles.previewCard}>
            <Image
              source={{ uri: previewUri }}
              style={styles.previewImage}
              resizeMode="cover"
              onError={() => setPreviewError(true)}
            />
            <Text style={styles.previewHint}>
              {imageUrl.trim() ? 'Live URL preview' : 'Fallback image active'}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRODUCT NAME</Text>
            <TextInput
              style={[styles.input, focusedField === 'name' && styles.inputFocused]}
              placeholder="Enter projector model name"
              placeholderTextColor="#4B5563"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRICE (THB)</Text>
            <TextInput
              style={[styles.input, focusedField === 'price' && styles.inputFocused]}
              placeholder="e.g. 5990"
              placeholderTextColor="#4B5563"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              onFocus={() => setFocusedField('price')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>STOCK QUANTITY</Text>
            <TextInput
              style={[styles.input, focusedField === 'stock' && styles.inputFocused]}
              placeholder="e.g. 15"
              placeholderTextColor="#4B5563"
              value={stock}
              onChangeText={setStock}
              keyboardType="number-pad"
              onFocus={() => setFocusedField('stock')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PRODUCT IMAGE URL</Text>
            <TextInput
              style={[styles.input, focusedField === 'image' && styles.inputFocused]}
              placeholder="https://example.com/projector.jpg"
              placeholderTextColor="#4B5563"
              value={imageUrl}
              onChangeText={(text) => {
                setImageUrl(text);
                setPreviewError(false);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onFocus={() => setFocusedField('image')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, isSaving && styles.submitBtnDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Ionicons
              name={isEditing ? 'save-outline' : 'add-circle-outline'}
              size={18}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.submitBtnText}>
              {isSaving ? 'SAVING...' : isEditing ? 'Update Product' : 'Add Product'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle" size={20} color="#6366F1" />
          <Text style={[styles.navText, styles.navTextActive]}>Add</Text>
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
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  navBtnPlaceholder: { width: 38 },
  scrollContent: { padding: 20, paddingBottom: 110 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  previewCard: {
    backgroundColor: '#151F32',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    marginBottom: 10,
  },
  previewHint: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#151F32',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#FFF',
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtn: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    zIndex: 10,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  navTextActive: { color: '#6366F1', fontWeight: 'bold' },
});
