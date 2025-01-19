import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAMITE-fUiZ9gEXyOLHwtX19FsSnSnR0Lk", // From API_KEY
  authDomain: "refeel-fad1a.firebaseapp.com",       // PROJECT_ID + firebaseapp.com
  projectId: "refeel-fad1a",                        // From PROJECT_ID
  storageBucket: "refeel-fad1a.firebasestorage.app", // From STORAGE_BUCKET
  messagingSenderId: "570671868607",                // From GCM_SENDER_ID
  appId: "1:570671868607:ios:2044148d59198c93e6f40a", // From GOOGLE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
