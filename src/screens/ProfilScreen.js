import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getUser, clearUser } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import colors from '../constants/colors';

export default function ProfilScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getUser();
      setUser(data);
      setLoading(false);
    })();
  }, []);

  async function handleLogout() {
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await clearUser();
          navigation.replace('Login');
        },
      },
    ]);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={{ fontSize: 40 }}>🏪</Text>
      </View>
      <Text style={styles.nama}>{user?.namaWarung || '-'}</Text>
      <Text style={styles.email}>{user?.email || '-'}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: colors.background },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  nama: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  email: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  button: {
    backgroundColor: colors.danger,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 32,
  },
  buttonText: { color: colors.white, fontWeight: '600', fontSize: 16 },
});
