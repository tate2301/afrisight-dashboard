// lib/firebase.js

import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2q-XZYZJv92uvriS6QerY9O42hOXo3Xg",
  authDomain: "afrisight-forms.firebaseapp.com",
  projectId: "afrisight-forms",
  storageBucket: "afrisight-forms.appspot.com",
  messagingSenderId: "275397252203",
  appId: "G-4VB0RJ7E96",
};

let app: FirebaseApp;

if(getApps().length === 0) {
    app = initializeApp(firebaseConfig);
}

// Initialize Firestore
// @ts-ignore
const db = getFirestore(app);

export { db };