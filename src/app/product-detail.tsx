import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop';

function ProductHeroImage({ uri }: { uri: string }) {
  const [src, setSrc] = useState(uri || FALLBACK_IMAGE);

  useEffect(() => {
    setSrc(uri && uri.trim() !== '' ? uri : FALLBACK_IMAGE);
  }, [uri]);

  return (
    <Image
      source={{ uri: src }}
      style={styles.mainProductImage}
      resizeMode="contain"
      onError={() => setSrc(FALLBACK_IMAGE)}
    />
  );
}

function formatPrice(rawPrice: string | string[] | undefined): string {
  const value = rawPrice ? String(rawPrice) : '';
  if (!value) return '0 บ.';

  if (value.includes('บ.')) {
    const numericPart = value.replace(/[^\d.]/g, '');
    const numeric = Number(numericPart);
    if (!Number.isNaN(numeric) && numericPart !== '') {
      return `${numeric.toLocaleString()} บ.`;
    }
    return value;
  }

  const numeric = Number(value.replace(/,/g, ''));
  if (Number.isNaN(numeric)) return value;
  return `${numeric.toLocaleString()} บ.`;
}

function formatStock(rawStock: string | string[] | undefined): string {
  const value = rawStock ? String(rawStock) : '0';
  const numeric = Number(value.replace(/,/g, ''));
  if (Number.isNaN(numeric)) return value;
  return numeric.toLocaleString();
}

function getStockStatus(stock: number): { label: string; color: string } {
  if (stock === 0) return { label: 'OUT OF STOCK', color: '#EF4444' };
  if (stock <= 2) return { label: 'LOW STOCK', color: '#F59E0B' };
  return { label: 'AVAILABLE', color: '#10B981' };
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    price?: string;
    stock?: string;
    image?: string;
  }>();

  const { id, name, price, stock, image } = params;

  const displayName = name ? String(name) : 'Unspecified Hardware Unit';
  const displayPrice = formatPrice(price);
  const displayStock = formatStock(stock);
  const stockNumeric = Number(String(stock ?? '0').replace(/,/g, ''));
  const stockStatus = getStockStatus(Number.isNaN(stockNumeric) ? 0 : stockNumeric);
  const displayImage =
    image && String(image).trim() !== '' ? String(image) : FALLBACK_IMAGE;
  const displayId = id ? String(id) : 'N/A';
  const qrData = encodeURIComponent(
    JSON.stringify({ id: displayId, name: displayName, price: displayPrice, stock: displayStock })
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMINAL MATRIX</Text>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/login')}>
          <Text style={styles.avatarText}>AD</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailCard}>
          <View style={styles.imageFrame}>
            <ProductHeroImage uri={displayImage} />
          </View>

          <Text style={styles.productNameText}>{displayName}</Text>

          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: stockStatus.color }]} />
            <Text style={[styles.statusText, { color: stockStatus.color }]}>
              {stockStatus.label}
            </Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>UNIT ID</Text>
              <Text style={styles.metricValue}>{displayId}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>PRICE</Text>
              <Text style={[styles.metricValue, styles.metricAccent]}>{displayPrice}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>STOCK</Text>
              <Text style={styles.metricValue}>{displayStock} Units</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>TYPE</Text>
              <Text style={styles.metricValue}>Projector</Text>
            </View>
          </View>

          {id ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                router.push({ pathname: '/add-product', params: { editId: String(id) } })
              }
            >
              <Ionicons name="settings-outline" size={16} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.editBtnText}>Modify Hardware Configuration</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.qrTitle}>QR CODE MATRIX</Text>
          <Text style={styles.qrSubtitle}>Scan to synchronize inventory record</Text>

          <View style={styles.qrContainer}>
            <View style={styles.qrInner}>
              <Image
                source={{
                  uri: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`,
                }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#FFF', letterSpacing: 2 },
  navBtn: { backgroundColor: '#1E293B', padding: 8, borderRadius: 10 },
  avatar: {
    backgroundColor: '#6366F1',
    width: 35,
    height: 35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontWeight: 'bold', color: '#FFF', fontSize: 12 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  detailCard: {
    backgroundColor: '#151F32',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  imageFrame: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    marginBottom: 20,
  },
  mainProductImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#1E293B',
  },
  productNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    alignSelf: 'flex-start',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  metricsGrid: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 4,
    marginBottom: 20,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  metricLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  metricValue: { fontSize: 14, color: '#FFF', fontWeight: 'bold' },
  metricAccent: { color: '#6366F1' },
  editBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  editBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 20,
  },
  qrTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  qrSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 16,
    fontWeight: '500',
  },
  qrContainer: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 16,
    alignItems: 'center',
  },
  qrInner: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qrImage: { width: 160, height: 160 },
});
