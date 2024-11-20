import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration. Use your own app.config.js file to store the following values.
const firebaseConfig = {
    apiKey: Constants.expoConfig.extra.apiKey,
    authDomain: Constants.expoConfig.extra.authDomain,
    projectId: Constants.expoConfig.extra.projectId,
    storageBucket: Constants.expoConfig.extra.storageBucket,
    messagingSenderId: Constants.expoConfig.extra.messagingSenderId,
    appId: Constants.expoConfig.extra.appId,
    measurementId: Constants.expoConfig.extra.measurementId,
};

// Initialize Firebase app only if no apps are initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore database and storage services
const db = getFirestore(app);
const storage = getStorage(app);

// Firebase authentication service with AsyncStorage for persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const routes = collection(db, 'routes');
const users = collection(db, 'users');
const markers = collection(db, 'markers');

// Export the Firebase services that will be used in the application
export { 
    db,
    storage, 
    collection, 
    addDoc, 
    query, 
    onSnapshot, 
    deleteDoc, 
    doc,
    getDoc, 
    getDocs, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL,
    setDoc,
    updateDoc,
    auth,
    routes,
    users,
    markers,
};