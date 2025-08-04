// firebase/config.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBXRjIqZcdG9ExVVUen99KtE5b3eCp4bsU',
  authDomain: 'tripnest-1ace1.firebaseapp.com',
  projectId: 'tripnest-1ace1',
  storageBucket: 'tripnest-1ace1.firebasestorage.app',
  messagingSenderId: '682881105690',
  appId: '1:682881105690:web:71f5931fe5a757f40f76a3',
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Persistent Auth using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Firestore
const db = getFirestore(app);

// ✅ Export
export { auth, db };
