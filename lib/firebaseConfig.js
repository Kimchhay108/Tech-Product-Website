// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB56ViG7mhzmpWareDi9V2a5YI3SDL3ZBU",
  authDomain: "tech-product-eb904.firebaseapp.com",
  projectId: "tech-product-eb904",
  storageBucket: "tech-product-eb904.firebasestorage.app",
  messagingSenderId: "181942140242",
  appId: "1:181942140242:web:caf41daf46e350b337ce8b",
  measurementId: "G-XGWRJ5TRZK"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// For testing in local dev only (browser)
if (typeof window !== "undefined") {
    auth.appVerificationDisabledForTesting = false; // optional, for testing
}
