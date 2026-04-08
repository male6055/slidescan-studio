// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzGKPDdiLUBn5PW8A7U8YTe9PppchLEoM",
  authDomain: "slidescanstudioi.firebaseapp.com",
  projectId: "slidescanstudioi",
  storageBucket: "slidescanstudioi.firebasestorage.app",
  messagingSenderId: "480578989427",
  appId: "1:480578989427:web:4a8cb1c204881167d7e906",
  measurementId: "G-175L0YX5HQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);