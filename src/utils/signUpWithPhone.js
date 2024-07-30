import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

const signUpWithPhone = async (email, phoneNo) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        message: "Email already in use",
        statusCode: 400,
        confirmation: null,
      };
    }

    const q2 = query(usersRef, where("phoneNo", "==", phoneNo));
    const querySnapshot2 = await getDocs(q2);

    if (!querySnapshot2.empty) {
      return {
        message: "Phone no already in use",
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
    return { message: error.message, statusCode: 500, confirmation: null };
  }
};

export default signUpWithPhone;
