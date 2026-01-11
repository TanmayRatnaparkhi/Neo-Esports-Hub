import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  increment,
  onSnapshot,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8Xl3RQMHUhsiJS4Kk2y64Rsnwoh3jVkI",
  authDomain: "neo-esports-hub.firebaseapp.com",
  projectId: "neo-esports-hub",
  storageBucket: "neo-esports-hub.firebasestorage.app",
  messagingSenderId: "1033553084106",
  appId: "1:1033553084106:web:33a391d3e7eb1faaae7e33",
  measurementId: "G-5952VXT79F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  increment,
  onSnapshot,
  Timestamp
};
