import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

function ProductThumbnail({ uri }: { uri: string }) {
  const [src, setSrc] = useState(uri || FALLBACK_IMAGE);

  useEffect(() => {
    setSrc(uri && uri.trim() !== '' ? uri : FALLBACK_IMAGE);
  }, [uri]);

  return (
    <Image
      source={{ uri: src }}
      style={styles.productImage}
      resizeMode="cover"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  );
}

export default function StockScreen() {
  const router = useRouter();
  const [projectors, setProjectors] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadProjectorData = async () => {
        try {
          let savedData = await AsyncStorage.getItem(STORAGE_KEY);

          if (savedData === null) {
            const legacyData = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
            if (legacyData !== null) {
              savedData = legacyData;
              await AsyncStorage.setItem(STORAGE_KEY, legacyData);
            }
          }

          if (savedData !== null) {
            setProjectors(JSON.parse(savedData));
          } else {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTOR_DATA));
            setProjectors(INITIAL_PROJECTOR_DATA);
          }
        } catch (error) {
          console.error('Failed to load product data:', error);
        }
      };
      loadProjectorData();
    }, [])
  );

  const handleDelete = async (id: string) => {
    try {
      const updatedData = projectors.filter((item) => item.id !== id);
      setProjectors(updatedData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const getStatusText = (stock: number) => {
    if (stock === 0) return 'OUT OF STOCK';
    if (stock <= 2) return 'LOW STOCK';
    return 'AVAILABLE';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMINAL STOCK</Text>
        <TouchableOpacity onPress={() => router.push('/add-product')} style={styles.navBtn}>
          <Ionicons name="add" size={22} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={projectors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const displayPrice = item.price.toString().includes('บ.')
            ? item.price
            : `${Number(item.price).toLocaleString()} บ.`;
          const currentStatus = getStatusText(item.stock);
          const displayImage =
            item.image && item.image.trim() !== '' ? item.image : FALLBACK_IMAGE;

          return (
            <TouchableOpacity
              style={styles.itemCard}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: '/product-detail',
                  params: {
                    name: item.name,
                    price: displayPrice,
                    stock: item.stock,
                    image: displayImage,
                  },
                })
              }
            >
              <View style={styles.leftContent}>
                <ProductThumbnail uri={displayImage} />

                <View style={styles.infoContainer}>
                  <View style={styles.badgeRow}>
                    <Text
                      style={[
                        styles.statusTag,
                        {
                          backgroundColor:
                            item.stock === 0
                              ? '#2D1F29'
                              : item.stock <= 2
                                ? '#2A241F'
                                : '#1A2E26',
                          color:
                            item.stock === 0
                              ? '#EF4444'
                              : item.stock <= 2
                                ? '#F59E0B'
                                : '#10B981',
                        },
                      ]}
                    >
                      {currentStatus}
                    </Text>
                    <Text style={styles.itemStock}>QTY: {item.stock} Units</Text>
                  </View>

                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>{displayPrice}</Text>
                </View>
              </View>

              <View style={styles.rightContent}>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      router.push({ pathname: '/add-product', params: { editId: item.id } })
                    }
                  >
                    <Ionicons name="settings-outline" size={14} color="#38BDF8" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/dashboard')}>
          <Ionicons name="grid-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/add-product')}>
          <Ionicons name="add-circle-outline" size={20} color="#9CA3AF" />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/stock')}>
          <MaterialCommunityIcons name="cube" size={20} color="#6366F1" />
          <Text style={[styles.navText, styles.navTextActive]}>Products</Text>
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
  headerTitle: { fontSize: 14, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  listContent: { paddingBottom: 100 },
  itemCard: {
    backgroundColor: '#151F32',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  productImage: {
    width: 65,
    height: 65,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    marginRight: 12,
  },
  infoContainer: { flex: 1, justifyContent: 'space-between' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusTag: {
    fontSize: 8,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    overflow: 'hidden',
    letterSpacing: 0.5,
    marginRight: 10,
  },
  itemStock: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
  itemName: { fontSize: 14, fontWeight: 'bold', color: '#FFF' },
  itemPrice: { fontSize: 13, color: '#6366F1', fontWeight: '700', marginTop: 4 },
  rightContent: { justifyContent: 'center', alignItems: 'flex-end', marginLeft: 12 },
  actionRow: { flexDirection: 'row', alignItems: 'center' },
  editBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10, marginRight: 8 },
  deleteBtn: { backgroundColor: '#2D1F29', padding: 8, borderRadius: 10 },
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
