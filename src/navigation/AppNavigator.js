import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { getUser } from '../services/storage';
import LoadingSpinner from '../components/LoadingSpinner';

import LoginScreen from '../screens/LoginScreen';
import KatalogScreen from '../screens/KatalogScreen';
import DetailProdukScreen from '../screens/DetailProdukScreen';
import TambahProdukScreen from '../screens/TambahProdukScreen';
import KeranjangScreen from '../screens/KeranjangScreen';
import RiwayatScreen from '../screens/RiwayatScreen';
import ProfilScreen from '../screens/ProfilScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const KatalogStack = createNativeStackNavigator();

// Stack khusus di dalam tab "Katalog" supaya bisa navigasi ke Detail & Tambah Produk
function KatalogStackNavigator() {
  return (
    <KatalogStack.Navigator>
      <KatalogStack.Screen name="KatalogList" component={KatalogScreen} options={{ title: 'Katalog Produk' }} />
      <KatalogStack.Screen name="DetailProduk" component={DetailProdukScreen} options={{ title: 'Detail Produk' }} />
      <KatalogStack.Screen name="TambahProduk" component={TambahProdukScreen} options={{ title: 'Tambah Produk' }} />
    </KatalogStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Katalog: 'storefront-outline',
            Keranjang: 'cart-outline',
            Riwayat: 'time-outline',
            Profil: 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Katalog" component={KatalogStackNavigator} />
      <Tab.Screen name="Keranjang" component={KeranjangScreen} />
      <Tab.Screen name="Riwayat" component={RiwayatScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // cek apakah sudah pernah login sebelumnya (session tersimpan di AsyncStorage)
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setInitialRoute(user ? 'MainTabs' : 'Login');
    })();
  }, []);

  if (!initialRoute) return <LoadingSpinner />;

  return (
    <RootStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="MainTabs" component={MainTabs} />
    </RootStack.Navigator>
  );
}
