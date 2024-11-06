import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Firebase configuration. Use your own .env file to store the following values.
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

// Export the Firebase services that will be used in the application.
export { db,
         storage, 
         collection, 
         addDoc, 
         query, 
         onSnapshot, 
         deleteDoc, 
         doc, 
         getDocs, 
         ref, 
         uploadBytesResumable, 
         getDownloadURL };