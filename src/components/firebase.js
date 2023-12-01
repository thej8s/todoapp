import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBANtvxOVqedpC4DAQ7jJRk0lQgb0B0-CY",
  authDomain: "todo-b68f8.firebaseapp.com",
  projectId: "todo-b68f8",
  storageBucket: "todo-b68f8.appspot.com",
  messagingSenderId: "746844370879",
  appId: "1:746844370879:web:cf3b7e725f9ea655c4530a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const db = getFirestore(app);

export default db;
