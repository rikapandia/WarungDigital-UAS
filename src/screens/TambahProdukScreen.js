import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getProducts, saveProducts } from '../services/storage';
import colors from '../constants/colors';

export default function TambahProdukScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  async function pickFromCamera() {
    // WAJIB minta izin dulu sebelum pakai kamera
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      // handle denied state
      Alert.alert(
        'Izin Kamera Ditolak',
        'Aplikasi butuh izin kamera untuk memotret produk. Aktifkan izin di Pengaturan HP.'
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  async function pickFromGallery() {
    // izin akses galeri, terpisah dari izin kamera
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      // handle denied state
      Alert.alert(
        'Izin Galeri Ditolak',
        'Aplikasi butuh izin akses galeri untuk memilih foto produk. Aktifkan izin di Pengaturan HP.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  function handlePickImage() {
    Alert.alert('Pilih Foto Produk', 'Ambil dari mana?', [
      { text: 'Kamera', onPress: pickFromCamera },
      { text: 'Galeri', onPress: pickFromGallery },
      { text: 'Batal', style: 'cancel' },
    ]);
  }

  function validate() {
    const newErrors = {};
    if (!nama.trim()) newErrors.nama = 'Nama produk tidak boleh kosong';
    if (!harga.trim()) {
      newErrors.harga = 'Harga tidak boleh kosong';
    } else if (isNaN(Number(harga)) || Number(harga) <= 0) {
      newErrors.harga = 'Harga harus berupa angka lebih dari 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const produkBaru = {
        id: Date.now().toString(),
        nama: nama.trim(),
        harga: Number(harga),
        deskripsi: deskripsi.trim(),
        foto,
      };
      const current = await getProducts();
      await saveProducts([produkBaru, ...current]);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <TouchableOpacity style={styles.photoBox} onPress={handlePickImage}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.photo} />
        ) : (
          <Text style={styles.photoText}>📷 Tap untuk pilih foto{'\n'}(Kamera / Galeri)</Text>
        )}
      </TouchableOpacity>
      {foto && (
        <TouchableOpacity onPress={handlePickImage} style={styles.changePhotoBtn}>
          <Text style={styles.changePhotoText}>Ganti Foto</Text>
        </TouchableOpacity>
      )}

      <TextInput style={styles.input} placeholder="Nama Produk" value={nama} onChangeText={setNama} />
      {errors.nama && <Text style={styles.error}>{errors.nama}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Harga (contoh: 15000)"
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
      />
      {errors.harga && <Text style={styles.error}>{errors.harga}</Text>}

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Deskripsi (opsional)"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Menyimpan...' : 'Simpan Produk'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  photoBox: {
    height: 160,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoText: { color: colors.textLight, textAlign: 'center' },
  changePhotoBtn: { alignSelf: 'center', marginBottom: 16, marginTop: -10 },
  changePhotoText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: { color: colors.danger, fontSize: 12, marginBottom: 8 },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, marginTop: 16 },
  buttonText: { color: colors.white, textAlign: 'center', fontWeight: '600', fontSize: 16 },
});
