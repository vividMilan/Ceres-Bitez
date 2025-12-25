import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC55p9qgX3y_qzzvBLR9HWxAQ_TcPM_c0Q",
  authDomain: "cerez-bites.firebaseapp.com",
  projectId: "cerez-bites",
  storageBucket: "cerez-bites.firebasestorage.app",
  messagingSenderId: "386110857",
  appId: "1:386110857:web:4da1a94ee78c27bdcc7d58",
  measurementId: "G-4MZSM9XDNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);