import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQORGvYpX558lWlGhY28R-pjuYyJ5VWzE",
  authDomain: "eduinnotech-typing-web.firebaseapp.com",
  projectId: "eduinnotech-typing-web",
  storageBucket: "eduinnotech-typing-web.firebasestorage.app",
  messagingSenderId: "134393964411",
  appId: "1:134393964411:web:807d21ce60220f93b7bfde",
  measurementId: "G-GCYWL69429"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGooglePopup = async () => {
  return signInWithPopup(auth, googleProvider);
};

export default app;

