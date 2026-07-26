import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { addTransaction } from '../services/storage';
import EmptyState from '../components/EmptyState';
import ScreenHeader from '../components/ScreenHeader';
import colors from '../constants/colors';

export default function KeranjangScreen({ navigation }) {
  const { cart, removeFromCart, clearCart, total } = useCart();

  async function handleCheckout() {
    if (cart.length === 0) return;
    const transaksi = {
      id: Date.now().toString(),
      tanggal: new Date().toISOString(),
      items: cart,
      total,
    };
    await addTransaction(transaksi);
    clearCart();
    Alert.alert('Sukses', 'Transaksi berhasil disimpan ke riwayat');
    navigation.navigate('Riwayat');
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Keranjang Belanja" subtitle="Cek pesananmu sebelum checkout" icon="🛒" />

      {cart.length === 0 ? (
        <EmptyState message="Keranjang masih kosong" />
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemNama}>{item.nama}</Text>
                  <Text style={styles.itemSub}>
                    {item.qty} x Rp {item.harga.toLocaleString('id-ID')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={styles.remove}>Hapus</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: Rp {total.toLocaleString('id-ID')}</Text>
            <TouchableOpacity style={styles.button} onPress={handleCheckout}>
              <Text style={styles.buttonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  itemNama: { fontSize: 16, fontWeight: '600', color: colors.text },
  itemSub: { fontSize: 13, color: colors.textLight, marginTop: 2 },
  remove: { color: colors.danger, fontWeight: '600' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
  totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: colors.text },
  button: { backgroundColor: colors.secondary, padding: 14, borderRadius: 8 },
  buttonText: { color: colors.white, textAlign: 'center', fontWeight: '600', fontSize: 16 },
});
