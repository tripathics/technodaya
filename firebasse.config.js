import firebase from 'firebase/compat/app'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDPYJNRPPshCclnmM6gN9IphEeSaLWEgHU",
  authDomain: "designothon-bc5ca.firebaseapp.com",
  projectId: "designothon-bc5ca",
  storageBucket: "designothon-bc5ca.appspot.com",
  messagingSenderId: "463957909104",
  appId: "1:463957909104:web:4f8f406734eb0bc43edeb5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let fs = null;

export { app, auth, db, fs, storage };