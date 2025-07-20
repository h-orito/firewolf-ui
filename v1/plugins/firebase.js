import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  linkWithPopup,
  signOut,
  getRedirectResult,
  GoogleAuthProvider,
  TwitterAuthProvider
} from 'firebase/auth'

const config = {
  databaseURL: process.env.FIREBASE_DATABASEURL,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID
}

const firebase = initializeApp(config)
const firebaseAuth = getAuth(firebase)

export {
  firebaseAuth,
  onAuthStateChanged,
  signInWithPopup,
  linkWithPopup,
  getRedirectResult,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider
}
