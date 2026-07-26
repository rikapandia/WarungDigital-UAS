import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function ProductCard({ produk, onPress, onDelete }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        {produk.foto ? (
          <Image source={{ uri: produk.foto }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={{ fontSize: 32 }}>🛍️</Text>
          </View>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.deleteBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.nama} numberOfLines={1}>{produk.nama}</Text>
        <Text style={styles.harga}>Rp {produk.harga.toLocaleString('id-ID')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageWrapper: { position: 'relative' },
  image: { width: '100%', height: 120 },
  placeholder: { backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center' },
  deleteBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(74,4,78,0.55)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: { color: colors.white, fontSize: 13, fontWeight: 'bold' },
  info: { padding: 10 },
  nama: { fontSize: 14, fontWeight: '600', color: colors.text },
  harga: { fontSize: 13, color: colors.primary, fontWeight: '700', marginTop: 4 },
});
