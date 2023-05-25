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
  apiKey: "AIzaSyDCE3L4btDOZCpO01fhmBnyfavKjLKTawU",
  authDomain: "finals-f8e00.firebaseapp.com",
  projectId: "finals-f8e00",
  storageBucket: "finals-f8e00.appspot.com",
  messagingSenderId: "660696117758",
  appId: "1:660696117758:web:60330430fd501ccf94d0af",
  measurementId: "G-V8ZD94EYN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db };
export { auth };