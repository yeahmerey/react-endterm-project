// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD01gi7dRBDm7ukiKI48P7kbrMc_3iMhD4",
  authDomain: "main-endterm.firebaseapp.com",
  projectId: "main-endterm",
  storageBucket: "main-endterm.firebasestorage.app",
  messagingSenderId: "408572943664",
  appId: "1:408572943664:web:b5b25a3c4896f60bff7cf5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
export const auth = getAuth(app);

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
