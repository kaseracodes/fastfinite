import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const updateProfile = async (field, value, uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      [field]: value,
    });

    return { statusCode: 200, message: "Profile updated successfully" };
  } catch (error) {
    return { statusCode: 500, message: "Error updating profile" };
  }
};

export default updateProfile;
