import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsnT-teePsL608OSVROzLLtISzcGCnGDA",
  authDomain: "eldertasks-9b0da.firebaseapp.com",
  projectId: "eldertasks-9b0da",
  storageBucket: "eldertasks-9b0da.appspot.com",
  messagingSenderId: "900453051325",
  appId: "1:900453051325:web:8a45f2f48b498fe11140d4",
  measurementId: "G-LPPB485ENS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the initialized app, db, analytics, and auth
export { app, db, analytics, auth };