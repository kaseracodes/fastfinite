// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  apiKey: "AIzaSyAfLyDfI_BvXx1ezoY7fMjh52j_kFPtcT0",
  authDomain: "fast-finite.firebaseapp.com",
  projectId: "fast-finite",
  storageBucket: "fast-finite.appspot.com",
  messagingSenderId: "336254981533",
  appId: "1:336254981533:web:1129afd03b9c619d184b74",
  measurementId: "G-JC1SS6KR4Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(); // firestore database
const database = getDatabase(); // realtime database
const storage = getStorage();
const auth = getAuth(app);

export { app, db, database, storage, auth, analytics };
