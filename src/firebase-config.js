import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDdhZbZqkIw5gKJC6oWAqCHfN5XkFwg_ZM",
  authDomain: "dummt-18695.firebaseapp.com",
  projectId: "dummt-18695",
  storageBucket: "dummt-18695.firebasestorage.app",
  messagingSenderId: "766319273024",
  appId: "1:766319273024:web:36768cbcd3e5d51f5ceba5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
