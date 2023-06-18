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

const firebaseConfig2 = {
  apiKey: "AIzaSyAO6HpH79aMSXHD0QXub1y5VUPkMX1bct4",
  authDomain: "technodaya-test2.firebaseapp.com",
  projectId: "technodaya-test2",
  storageBucket: "technodaya-test2.appspot.com",
  messagingSenderId: "796938188595",
  appId: "1:796938188595:web:d90914954265985259f046",
  measurementId: "G-76P00J2XV4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let fs = null;

export { app, auth, db, fs, storage };