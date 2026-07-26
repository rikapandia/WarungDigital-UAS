import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getTransactions } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import colors from '../constants/colors';

export default function RiwayatScreen() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getTransactions();
    setTransaksi(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Riwayat Transaksi" subtitle="Catatan penjualan warungmu" icon="🧾" />
      {transaksi.length === 0 ? (
        <EmptyState message="Belum ada transaksi" />
      ) : (
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.tanggal}>{new Date(item.tanggal).toLocaleString('id-ID')}</Text>
              <Text style={styles.jumlahItem}>{item.items.length} produk</Text>
              <Text style={styles.total}>Rp {item.total.toLocaleString('id-ID')}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { backgroundColor: colors.white, padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.accent },
  tanggal: { fontSize: 13, color: colors.textLight },
  jumlahItem: { fontSize: 14, color: colors.text, marginTop: 4 },
  total: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginTop: 4 },
});
