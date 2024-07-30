import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const verifyOTP = async (confirmationResult, otp, email, name, phoneNo) => {
  try {
    const res = await confirmationResult.confirm(otp);
    console.log(res.user);
    const uid = res.user.uid;

    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const userData = {
        email,
        name,
        phoneNo,
        address: "",
        profilePic: "",
        bookings: [],
      };
      await setDoc(doc(db, "users", uid), userData);

      return {
        message: "User verified and saved successfully",
        statusCode: 200,
        user: userData,
      };
    } else {
      return {
        message: "Logged in successfully",
        statusCode: 200,
        user: userDocSnap.data(),
      };
    }
  } catch (error) {
    console.error("Error verifying OTP or saving user: ", error);
    return {
      message: "Error verifying OTP or saving user",
      statusCode: 500,
      user: null,
    };
  }
};

export default verifyOTP;
