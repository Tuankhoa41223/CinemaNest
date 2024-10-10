import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth,GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDzCYRaULqCc3TQltxSQ_Nvj_L9b8xPKBA",
    authDomain: "cinemanest-ab4e7.firebaseapp.com",
    projectId: "cinemanest-ab4e7",
    storageBucket: "cinemanest-ab4e7.appspot.com",
    messagingSenderId: "803334687014",
    appId: "1:803334687014:web:9941d581d821eed9af99e7",
    measurementId: "G-7L9F1VXWNL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();