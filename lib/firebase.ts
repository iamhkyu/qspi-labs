import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;

export function getFirebaseApp() {
  if (typeof window === "undefined") return undefined;
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return undefined;
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0] as FirebaseApp;
  }
  return app;
}

export function getFirestoreDb() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  return getFirestore(firebaseApp);
}

export function getAnalyticsService() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp || typeof window === "undefined") return undefined;
  return getAnalytics(firebaseApp);
}
