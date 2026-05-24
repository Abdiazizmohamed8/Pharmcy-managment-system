import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUQ3zZNu69RwefvrQvF-KZ6qJCHBnv1hY",
  authDomain: "anfac-pharmacy.firebaseapp.com",
  projectId: "anfac-pharmacy",
  storageBucket: "anfac-pharmacy.appspot.com",
  messagingSenderId: "843885450050",
  appId: "1:843885450050:web:c68a3b0418dda592376edb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);