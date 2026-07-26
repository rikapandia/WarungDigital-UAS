import AsyncStorage from '@react-native-async-storage/async-storage';

// Semua "nama kunci" penyimpanan dikumpulkan di sini biar tidak typo di banyak tempat
const KEYS = {
  USER: 'warung_user',
  PRODUCTS: 'warung_products',
  TRANSACTIONS: 'warung_transactions',
};

// ---- Data user (session login) ----
export async function saveUser(user) {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function getUser() {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export async function clearUser() {
  await AsyncStorage.removeItem(KEYS.USER);
}

// ---- Data produk ----
export async function getProducts() {
  const data = await AsyncStorage.getItem(KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
}

export async function saveProducts(products) {
  await AsyncStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

// ---- Data transaksi (riwayat) ----
export async function getTransactions() {
  const data = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
}

export async function addTransaction(transaction) {
  const current = await getTransactions();
  const updated = [transaction, ...current];
  await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
  return updated;
}

export default {
  saveUser,
  getUser,
  clearUser,
  getProducts,
  saveProducts,
  getTransactions,
  addTransaction,
};
