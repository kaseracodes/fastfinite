// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  apiKey: "AIzaSyAM21ipI9MXcAv9AFQXZYheBPww7jqzi48",
  authDomain: "fastfinite-bike-rental.firebaseapp.com",
  projectId: "fastfinite-bike-rental",
  storageBucket: "fastfinite-bike-rental.appspot.com",
  messagingSenderId: "349020641736",
  appId: "1:349020641736:web:6485a37a255d9158de48fd",
  measurementId: "G-4V23PHP2BL",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const database = getDatabase();
const storage = getStorage();
const auth = getAuth(app);

// connectFunctionsEmulator(getFunctions(app), "localhost", 5000);

export { app, db, database, storage, auth, analytics };
