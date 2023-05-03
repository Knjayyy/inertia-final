// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUOJNwHRfUN6vSYRl72bk3EsXGJQPNEiA",
  authDomain: "fir-mid-3e620.firebaseapp.com",
  projectId: "fir-mid-3e620",
  storageBucket: "fir-mid-3e620.appspot.com",
  messagingSenderId: "231712894715",
  appId: "1:231712894715:web:83a8502a92075fcaf00a5e",
  measurementId: "G-BC1LBYE3H9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db };
export { auth };