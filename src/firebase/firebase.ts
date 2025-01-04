import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX7W-sQVPqH7Kd3Xk1QRodDvctMtas4bM",
  authDomain: "escola-da-biblia-litoral.firebaseapp.com",
  projectId: "escola-da-biblia-litoral",
  storageBucket: "escola-da-biblia-litoral.firebasestorage.app",
  messagingSenderId: "776370351856",
  appId: "1:776370351856:web:114a6ed27a08a43eca9c35",
  measurementId: "G-Z1JR9ZQV1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, 'edb-app');
// const analytics = getAnalytics(app);

export { app, auth, db };