import { initializeApp } from 'firebase/app'; // Import Firebase app initialization
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Import Firebase Auth methods
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for persistence

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMITE-fUiZ9gEXyOLHwtX19FsSnSnR0Lk", 
  authDomain: "refeel-fad1a.firebaseapp.com",       
  projectId: "refeel-fad1a",                        
  storageBucket: "refeel-fad1a.firebasestorage.app", 
  messagingSenderId: "570671868607",                
  appId: "1:570671868607:ios:2044148d59198c93e6f40a", 
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage) // Use AsyncStorage for auth persistence
});
