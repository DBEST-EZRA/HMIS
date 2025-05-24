import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBzxaM0k1wCkFE02Sq9K1w1EpBGnW6758",
  authDomain: "hmisbybeta.firebaseapp.com",
  projectId: "hmisbybeta",
  storageBucket: "hmisbybeta.firebasestorage.app",
  messagingSenderId: "396632417264",
  appId: "1:396632417264:web:763e632598a0d0efb57335",
  measurementId: "G-271NMB2E1V",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
