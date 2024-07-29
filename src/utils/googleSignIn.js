import { auth } from "@/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleSignIn = async () => {
  const googleProvider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

export default googleSignIn;
