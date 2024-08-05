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
  apiKey: "AIzaSyAM21ipI9MXcAv9AFQXZYheBPww7jqzi48",
  authDomain: "fastfinite-bike-rental.firebaseapp.com",
  projectId: "fastfinite-bike-rental",
  storageBucket: "fastfinite-bike-rental.appspot.com",
  messagingSenderId: "349020641736",
  appId: "1:349020641736:web:6485a37a255d9158de48fd",
  measurementId: "G-4V23PHP2BL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(); // firestore database
const database = getDatabase(); // realtime database
const storage = getStorage();
const auth = getAuth(app);

export { app, db, database, storage, auth, analytics };
