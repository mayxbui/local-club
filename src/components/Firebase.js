// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("key", process.env.REACT_APP_FIREBASE_API_KEY)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "local-business-portal-c4339.firebaseapp.com",
  projectId: "local-business-portal-c4339",
  storageBucket: "local-business-portal-c4339.firebasestorage.app",
  messagingSenderId: "553450575331",
  appId: "1:553450575331:web:e7bb387618a6235f113cd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db = getFirestore(app);
export default app;