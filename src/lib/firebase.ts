// File: src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Analytics ID
};

// Initialize Firebase (Singleton pattern taaki baar baar load na ho)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Core Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Safe Analytics Initialization (Only on Client Side)
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  // Check if browser supports Analytics (ad blockers can block it)
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics is active! 🚀");
    }
  }).catch((err) => {
      console.error("Firebase Analytics failed to initialize", err);
  });
}

export { db, auth, storage, analytics };