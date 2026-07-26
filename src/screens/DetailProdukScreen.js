import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import colors from '../constants/colors';

export default function DetailProdukScreen({ route, navigation }) {
  // "route.params" adalah cara menerima data yang dikirim dari layar sebelumnya
  const { produk } = route.params;
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(produk);
    Alert.alert('Berhasil', `${produk.nama} ditambahkan ke keranjang`);
  }

  return (
    <View style={styles.container}>
      {produk.foto ? (
        <Image source={{ uri: produk.foto }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={{ fontSize: 48 }}>🛒</Text>
        </View>
      )}
      <Text style={styles.nama}>{produk.nama}</Text>
      <Text style={styles.harga}>Rp {produk.harga.toLocaleString('id-ID')}</Text>
      {produk.deskripsi ? <Text style={styles.deskripsi}>{produk.deskripsi}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Tambah ke Keranjang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  image: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  placeholder: { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  nama: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  harga: { fontSize: 18, color: colors.primary, marginVertical: 8 },
  deskripsi: { fontSize: 14, color: colors.textLight, marginBottom: 16 },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 'auto' },
  buttonText: { color: colors.white, textAlign: 'center', fontWeight: '600', fontSize: 16 },
});
