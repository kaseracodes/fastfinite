import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/config";

const signUpWithPhone = async (phoneNo) => {
  const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
  const confirmation = await signInWithPhoneNumber(auth, phoneNo, recaptcha);
  return confirmation;
};

export default signUpWithPhone;
