import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBe__vlpHkCxKMz9dHanCXt7w_2eCf40bE",
  authDomain: "cointofish-388d5.firebaseapp.com",
  projectId: "cointofish-388d5",
  storageBucket: "cointofish-388d5.firebasestorage.app",
  messagingSenderId: "29811382367",
  appId: "1:29811382367:web:2e340e6e2b7e2e9fe463ea",
  measurementId: "G-W6N7Y10Q4J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);