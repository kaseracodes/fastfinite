import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const fetchVehicle = async (id) => {
  try {
    const vehicleRef = doc(db, "vehicles", id);
    const vehicleDoc = await getDoc(vehicleRef);

    if (vehicleDoc.exists()) {
      return {
        statusCode: 200,
        vehicle: { id: vehicleDoc.id, ...vehicleDoc.data() },
        message: "Vehicle fetched successfully",
      };
    } else {
      return {
        statusCode: 404,
        vehicle: null,
        message: "Vehicle not found",
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      vehicle: null,
      message: "Error fetching vehicle",
    };
  }
};

export default fetchVehicle;
