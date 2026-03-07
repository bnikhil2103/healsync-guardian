import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAe6a60Y-Uaqoyc2zG8aFcJBJE5rY5EB3M",
  authDomain: "healgaurd.firebaseapp.com",
  projectId: "healgaurd",
  storageBucket: "healgaurd.firebasestorage.app",
  messagingSenderId: "554129198658",
  appId: "1:554129198658:web:794c3d89119b8d67db67db",
  measurementId: "G-827389MCS1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);