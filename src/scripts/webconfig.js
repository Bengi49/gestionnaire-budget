// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6eDLcKauHFRp3RT4jFaDKO_LaUmS0hfU",
  authDomain: "budgetsafe-1cc1b.firebaseapp.com",
  projectId: "budgetsafe-1cc1b",
  storageBucket: "budgetsafe-1cc1b.firebasestorage.app",
  messagingSenderId: "137894984595",
  appId: "1:137894984595:web:a670b7557c25f59efb4666",
  measurementId: "G-NLGTX9N331"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();

export const usersCollection = collection(db, 'users');
export const getEarningsCollection = (userId) => collection(db, `users/${userId}/earnings`);
export const getExpensesCollection = (userId) => collection(db, `users/${userId}/expenses`);
export { db, auth, analytics };