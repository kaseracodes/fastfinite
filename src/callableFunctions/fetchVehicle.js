/* eslint-disable no-unused-vars */
import { https } from "firebase-functions";
import admin from "../firebaseAdmin/config";

const db = admin.firestore;

export const fetchVehicle = https.onCall(async (data, context) => {
  const { id } = data;

  try {
    const vehicleRef = db.collection("vehicles").doc(id);
    const vehicleDoc = await vehicleRef.get();

    if (vehicleDoc.exists) {
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
});
