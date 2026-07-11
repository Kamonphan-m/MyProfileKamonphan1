import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router'; // 1. เพิ่มตัวนี้เข้ามา
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const GPU_CATALOG = [
 {
   id: '1',
   name: 'NVIDIA GeForce RTX 4090 Founders Edition 24GB GDDR6X',
   brand: 'NVIDIA',
   stock: 12,
   price: '$1,599.00',
   status: 'In Stock',
   tag: 'Flagship',
   imageUrl: 'https://i.ebayimg.com/images/g/Bf0AAOSwFxBoSpGW/s-l1600.webp',
 },
 {
   id: '2',
   name: 'ASUS ROG Strix GeForce RTX 4080 SUPER OC Edition 16GB',
   brand: 'ASUS',
   stock: 3,
   price: '$1,249.00',
   status: 'Low Stock',
   tag: 'Popular',
   imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=80',
 },
 {
   id: '3',
   name: 'AMD Radeon RX 7900 XTX Phantom Gaming 24GB OC',
   brand: 'AMD',
   stock: 0,
   price: '$999.00',
   status: 'Out of Stock',
   tag: 'Best Value',
   imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80',
 },
];
export default function GPUStoreScreen() {
 const [searchQuery, setSearchQuery] = useState('');
 return (
<View style={styles.container}>
     {/* 2. สั่งซ่อน Header ดั้งเดิมของ Expo ตรงนี้ */}
<Stack.Screen options={{ headerShown: false }} />
<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
       {/* --- Header ตามรูปที่ 2 --- */}
<View style={styles.header}>
<Pressable style={styles.iconButton}>
<Feather name="menu" size={22} color="#555555" />
</Pressable>
<Text style={styles.headerTitle}>Products</Text>
<Pressable style={styles.profileButton}>
<Feather name="user" size={18} color="#444444" />
</Pressable>
</View>
       {/* --- Search Section --- */}
<View style={styles.searchSection}>
<View style={styles.searchWrapper}>
<Feather name="search" size={18} color="#666666" style={styles.searchIcon} />
<TextInput
             style={styles.searchInput}
             placeholder="Search products..."
             placeholderTextColor="#999999"
             value={searchQuery}
             onChangeText={setSearchQuery}
           />
</View>
<Pressable style={styles.addProductButton}>
<Text style={styles.addProductText}>+ Add Product</Text>
</Pressable>
<Pressable style={styles.filterButton}>
<Text style={styles.filterText}>Filter ▼</Text>
</Pressable>
</View>
       {/* --- Product Cards --- */}
<ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
         {GPU_CATALOG.map((item) => (
<View key={item.id} style={styles.productCard}>
<View style={styles.imageWrapper}>
<Image source={{ uri: item.imageUrl }} style={styles.productImage} />
               {item.stock > 0 && (
<View style={styles.tagBadge}>
<Text style={styles.tagText}>{item.tag}</Text>
</View>
               )}
</View>
<View style={styles.infoWrapper}>
<View>
<Text style={styles.brandText}>{item.brand}</Text>
<Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
</View>
<View style={styles.stockRow}>
<Text style={styles.stockText}>Stock: {item.stock}</Text>
<Text style={[
                   styles.statusText,
                   { color: item.stock > 5 ? '#2E7D32' : item.stock > 0 ? '#EF6C00' : '#C62828' }
                 ]}>
                   • {item.status}
</Text>
</View>
<View style={styles.priceRow}>
<Text style={styles.priceText}>{item.price}</Text>
<Pressable style={[styles.actionButton, item.stock === 0 && styles.disabledButton]}>
<Feather name={item.stock > 0 ? "plus" : "slash"} size={16} color={item.stock > 0 ? "#FFFFFF" : "#8E8E93"} />
</Pressable>
</View>
</View>
</View>
         ))}
</ScrollView>
</SafeAreaView>
     {/* --- Bottom Tab --- */}
<View style={styles.tabBarContainer}>
<View style={styles.tabBar}>
<Pressable style={styles.tabItem}>
<Feather name="compass" size={20} color="#8E8E93" />
<Text style={styles.tabLabel}>Explore</Text>
</Pressable>
<Pressable style={styles.tabItem}>
<Feather name="box" size={20} color="#7F56D9" />
<Text style={[styles.tabLabel, styles.activeTabLabel]}>Products</Text>
</Pressable>
<Pressable style={styles.tabItem}>
<Feather name="user" size={20} color="#8E8E93" />
<Text style={styles.tabLabel}>Profile</Text>
</Pressable>
</View>
</View>
</View>
 );
}
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#FFFFFF',
   alignItems: 'center',
 },
 safeArea: {
   flex: 1,
   width: '100%',
   maxWidth: 540,
   backgroundColor: '#FFFFFF',
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   paddingHorizontal: 16,
   paddingVertical: 14,
   backgroundColor: '#FFFFFF',
 },
 headerTitle: {
   fontSize: 20,
   fontWeight: '600',
   color: '#7F56D9',
   letterSpacing: -0.3,
 },
 iconButton: {
   width: 36,
   height: 36,
   alignItems: 'center',
   justifyContent: 'center',
 },
 profileButton: {
   width: 34,
   height: 34,
   borderRadius: 17,
   backgroundColor: '#9A75F0',
   alignItems: 'center',
   justifyContent: 'center',
 },
 searchSection: {
   flexDirection: 'row',
   alignItems: 'center',
   paddingHorizontal: 16,
   paddingBottom: 16,
   gap: 8,
   backgroundColor: '#FFFFFF',
 },
 searchWrapper: {
   flex: 1.2,
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#F4F5F7',
   borderRadius: 8,
   paddingHorizontal: 10,
   height: 38,
 },
 searchIcon: {
   marginRight: 6,
 },
 searchInput: {
   flex: 1,
   fontSize: 14,
   color: '#111111',
 },
 addProductButton: {
   backgroundColor: '#8B5CF6',
   borderRadius: 8,
   paddingHorizontal: 12,
   height: 38,
   justifyContent: 'center',
   alignItems: 'center',
 },
 addProductText: {
   color: '#FFFFFF',
   fontSize: 13,
   fontWeight: '600',
 },
 filterButton: {
   height: 38,
   justifyContent: 'center',
   alignItems: 'center',
   paddingHorizontal: 4,
 },
 filterText: {
   color: '#9A75F0',
   fontSize: 13,
   fontWeight: '600',
 },
 listContainer: {
   paddingHorizontal: 16,
   paddingBottom: 100,
   gap: 16,
   backgroundColor: '#FFFFFF',
 },
 productCard: {
   flexDirection: 'row',
   backgroundColor: '#FFFFFF',
   borderRadius: 14,
   padding: 12,
   borderWidth: 1,
   borderColor: '#E5E5EA',
   ...Platform.select({
     ios: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.04,
       shadowRadius: 10,
     },
     android: {
       elevation: 1,
     },
   }),
 },
 imageWrapper: {
   position: 'relative',
   backgroundColor: '#F2F2F7',
   borderRadius: 10,
   overflow: 'hidden',
 },
 productImage: {
   width: 100,
   height: 100,
 },
 tagBadge: {
   position: 'absolute',
   top: 6,
   left: 6,
   backgroundColor: '#111111',
   paddingHorizontal: 6,
   paddingVertical: 2,
   borderRadius: 4,
 },
 tagText: {
   color: '#FFFFFF',
   fontSize: 9,
   fontWeight: '700',
   textTransform: 'uppercase',
 },
 infoWrapper: {
   flex: 1,
   marginLeft: 14,
   justifyContent: 'space-between',
 },
 brandText: {
   fontSize: 11,
   fontWeight: '600',
   color: '#8E8E93',
   textTransform: 'uppercase',
 },
 nameText: {
   fontSize: 14,
   fontWeight: '600',
   color: '#111111',
   lineHeight: 18,
   marginTop: 2,
 },
 stockRow: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 6,
   marginTop: 4,
 },
 stockText: {
   fontSize: 12,
   color: '#8E8E93',
 },
 statusText: {
   fontSize: 12,
   fontWeight: '600',
 },
 priceRow: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   marginTop: 6,
 },
 priceText: {
   fontSize: 16,
   fontWeight: '700',
   color: '#111111',
 },
 actionButton: {
   backgroundColor: '#111111',
   width: 30,
   height: 30,
   borderRadius: 8,
   alignItems: 'center',
   justifyContent: 'center',
 },
 disabledButton: {
   backgroundColor: '#E5E5EA',
 },
 tabBarContainer: {
   position: 'absolute',
   bottom: 0,
   left: 0,
   right: 0,
   alignItems: 'center',
   backgroundColor: 'transparent',
 },
 tabBar: {
   width: '100%',
   maxWidth: 540,
   flexDirection: 'row',
   backgroundColor: '#FFFFFF',
   paddingTop: 10,
   paddingBottom: Platform.OS === 'ios' ? 24 : 12,
   borderTopWidth: 0.5,
   borderColor: '#E5E5EA',
   justifyContent: 'space-around',
 },
 tabItem: {
   alignItems: 'center',
   gap: 2,
 },
 tabLabel: {
   fontSize: 10,
   color: '#8E8E93',
   fontWeight: '500',
 },
 activeTabLabel: {
   color: '#7F56D9',
   fontWeight: '600',
 },
});