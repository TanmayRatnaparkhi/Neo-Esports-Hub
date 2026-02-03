// firebase.js — clean config used across your whole site 🔥

// ✅ Firebase App (must be first)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// ✅ Firebase Auth
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ✅ Firestore
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  increment,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


// 🧱 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB8Xl3RQMHUhsiJS4Kk2y64Rsnwoh3jVkI",
  authDomain: "neo-esports-hub.firebaseapp.com",
  databaseURL: "https://neo-esports-hub-default-rtdb.firebaseio.com",
  projectId: "neo-esports-hub",
  storageBucket: "neo-esports-hub.firebasestorage.app",
  messagingSenderId: "1033553084106",
  appId: "1:1033553084106:web:33a391d3e7eb1faaae7e33",
  measurementId: "G-5952VXT79F"
};

// 🔥 Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ✅ Export ONLY Firebase features
export {
  app,
  auth,
  db,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  increment,
  Timestamp,
};
