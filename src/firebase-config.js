import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSj_6zW87hrvxA9GGEoSOpFT9q0GaMo-w",
  authDomain: "e-commerce-c6293.firebaseapp.com",
  projectId: "e-commerce-c6293",
  storageBucket: "e-commerce-c6293.firebasestorage.app",
  messagingSenderId: "932760350781",
  appId: "1:932760350781:web:b2ceb5e8f808ad6835fa54"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
