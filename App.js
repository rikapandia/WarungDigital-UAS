import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = {
  primary: '#EC4899',
  background: '#FFF0F6',
  white: '#FFFFFF',
  text: '#4A044E',
  textLight: '#A64D79',
  border: '#F9A8D4',
};

export default function App() {
  const [screen, setScreen] = useState('login');
  const [namaWarung, setNamaWarung] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('warung_user');
      if (user) setScreen('katalog');
      const produk = await AsyncStorage.getItem('warung_products');
      setProdukList(produk ? JSON.parse(produk) : []);
      setLoading(false);
    })();
  }, []);

  function validate() {
    const newErrors = {};
    if (!namaWarung.trim()) newErrors.namaWarung = 'Nama warung tidak boleh kosong';
    if (!email.trim()) newErrors.email = 'Email tidak boleh kosong';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Format email tidak valid';
    if (!password) newErrors.password = 'Password tidak boleh kosong';
    else if (password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    await AsyncStorage.setItem('warung_user', JSON.stringify({ namaWarung, email }));
    setScreen('katalog');
  }

  async function handleAddProduk() {
    const produkBaru = { id: Date.now().toString(), nama: 'Produk Contoh', harga: 10000 };
    const updated = [produkBaru, ...produkList];
    setProdukList(updated);
    await AsyncStorage.setItem('warung_products', JSON.stringify(updated));
  }

  async function handleLogout() {
    await AsyncStorage.removeItem('warung_user');
    setScreen('login');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🛒 Warung Digital</Text>
        <TextInput style={styles.input} placeholder="Nama Warung" value={namaWarung} onChangeText={setNamaWarung} />
        {errors.namaWarung && <Text style={styles.error}>{errors.namaWarung}</Text>}
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Katalog Produk</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddProduk}>
        <Text style={styles.buttonText}>+ Tambah Produk Contoh</Text>
      </TouchableOpacity>

      {produkList.length === 0 ? (
        <Text style={styles.empty}>Belum ada produk</Text>
      ) : (
        <FlatList
          data={produkList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nama}>{item.nama}</Text>
              <Text style={styles.harga}>Rp {item.harga.toLocaleString('id-ID')}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#E11D48', marginTop: 20 }]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: colors.white, borderRadius: 8, padding: 12, marginBottom: 4, borderWidth: 1, borderColor: colors.border },
  error: { color: '#E11D48', fontSize: 12, marginBottom: 8 },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 12 },
  buttonText: { color: colors.white, textAlign: 'center', fontWeight: '600', fontSize: 16 },
  empty: { textAlign: 'center', color: colors.textLight, marginTop: 40 },
  card: { backgroundColor: colors.white, padding: 14, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: colors.border },
  nama: { fontSize: 16, fontWeight: '600', color: colors.text },
  harga: { fontSize: 14, color: colors.primary, marginTop: 4 },
});