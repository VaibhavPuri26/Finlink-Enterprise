// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "finlink-enterprises.firebaseapp.com",
  projectId: "finlink-enterprises",
  storageBucket: "finlink-enterprises.appspot.com",
  messagingSenderId: "511470076223",
  appId: "1:511470076223:web:309b848e35a3f6ac61938a",
  measurementId: "G-NWB0FNPZ5K",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
