import { initializeApp } from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

import {
  getAuth,
} from "firebase/auth";

/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey:
    "AIzaSyCUQ3zZNu69RwefvrQvF-KZ6qJCHBnv1hY",

  authDomain:
    "anfac-pharmacy.firebaseapp.com",

  projectId:
    "anfac-pharmacy",

  storageBucket:
    "anfac-pharmacy.firebasestorage.app",

  messagingSenderId:
    "843885450050",

  appId:
    "1:843885450050:web:c68a3b0418dda592376edb",
};

/* =========================
   INITIALIZE FIREBASE
========================= */

const app =
  initializeApp(
    firebaseConfig
  );

/* =========================
   FIRESTORE DATABASE
========================= */

const db =
  getFirestore(app);

/* =========================
   FIREBASE AUTH
========================= */

const auth =
  getAuth(app);

/* =========================
   EXPORTS
========================= */

export {
  db,
  auth,
};

export default app;