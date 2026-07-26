import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProducts, saveProducts } from '../services/storage';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import colors from '../constants/colors';

export default function KatalogScreen({ navigation }) {
  const [produkList, setProdukList] = useState([]); // state data
  const [loading, setLoading] = useState(true); // state loading

  const loadProduk = useCallback(async () => {
    setLoading(true);
    const data = await getProducts();
    setProdukList(data);
    setLoading(false);
  }, []);

  // useEffect dengan dependency array -> jalan sekali saat screen pertama dibuka
  useEffect(() => {
    loadProduk();
  }, [loadProduk]);

  // reload data setiap kali kembali ke tab ini (misal habis nambah produk)
  useFocusEffect(
    useCallback(() => {
      loadProduk();
    }, [loadProduk])
  );

  async function handleDelete(id) {
    const updated = produkList.filter((p) => p.id !== id);
    setProdukList(updated);
    await saveProducts(updated);
  }

  // conditional rendering 1: loading
  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Katalog Produk" subtitle="Kelola produk warungmu" icon="🛍️" />

      <View style={styles.addRow}>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('TambahProduk')}>
          <Text style={styles.addBtnText}>+ Tambah Produk</Text>
        </TouchableOpacity>
      </View>

      {/* conditional rendering 2: empty vs ada data */}
      {produkList.length === 0 ? (
        <EmptyState message="Belum ada produk. Tambahkan produk pertamamu!" />
      ) : (
        <FlatList
          data={produkList}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProductCard
                produk={item}
                onPress={() => navigation.navigate('DetailProduk', { produk: item })}
                onDelete={() => handleDelete(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  addRow: { paddingHorizontal: 16, marginBottom: 4 },
  addBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: { color: colors.white, fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 14 },
  gridItem: { width: '48%' },
});
