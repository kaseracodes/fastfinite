import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

const login = async (phoneNo) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNo", "==", phoneNo));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        message: "User not registered",
        statusCode: 400,
        confirmation: null,
      };
    }

    const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
    const confirmation = await signInWithPhoneNumber(auth, phoneNo, recaptcha);
    return {
      message: "Phone number verification sent",
      statusCode: 200,
      confirmation,
    };
  } catch (error) {
    return {
      message: "Error during phone number authentication",
      statusCode: 500,
      confirmation: null,
    };
  }
};

export default login;
