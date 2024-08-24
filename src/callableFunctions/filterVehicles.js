/* eslint-disable no-unused-vars */
import { https } from "firebase-functions";
import dayjs from "dayjs";
import admin from "../firebaseAdmin/config";

const db = admin.firestore;

export const filterVehicles = https.onCall(async (data, context) => {
  const { pickupDate, dropoffDate, transmission, brands } = data;

  try {
    const vehiclesRef = db.collection("vehicles");
    let vehiclesQuery = vehiclesRef;

    // Filter by transmission type if not 'all'
    const transmissionFilters = Object.keys(transmission).filter(
      (key) => transmission[key]
    );

    if (transmissionFilters.length > 0) {
      vehiclesQuery = vehiclesQuery.where("type", "in", transmissionFilters);
    }

    // Filter by brand if any are selected
    const selectedBrands = Object.keys(brands).filter((brand) => brands[brand]);
    if (selectedBrands.length > 0) {
      vehiclesQuery = vehiclesQuery.where("brand", "in", selectedBrands);
    }

    // Fetch the vehicles
    const vehiclesSnapshot = await vehiclesQuery.get();
    const vehicles = vehiclesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch all bookings
    const bookingsRef = db.collection("bookings");
    const bookingsSnapshot = await bookingsRef.get();
    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Rearrange bookings for every vehicle
    const bookingsMap = {};
    for (const booking of bookings) {
      if (!bookingsMap[booking.vehicle_id]) {
        bookingsMap[booking.vehicle_id] = [];
      }
      bookingsMap[booking.vehicle_id].push({
        start: dayjs(booking.startTime),
        end: dayjs(booking.endTime),
      });
    }

    // Filter out vehicles with conflicting bookings
    const availableVehicles = [];
    for (const vehicle of vehicles) {
      const vehicleBookings = bookingsMap[vehicle.id] || [];
      let isAvailable = true;
      for (const booking of vehicleBookings) {
        if (
          (dayjs(pickupDate).isBefore(booking.end) &&
            dayjs(dropoffDate).isAfter(booking.start)) ||
          dayjs(pickupDate).isSame(booking.start) ||
          dayjs(pickupDate).isSame(booking.end) ||
          dayjs(dropoffDate).isSame(booking.start) ||
          dayjs(dropoffDate).isSame(booking.end)
        ) {
          isAvailable = false;
          break;
        }
      }
      if (isAvailable) {
        availableVehicles.push(vehicle);
      }
    }

    return {
      statusCode: 200,
      availableVehicles,
      message: "Fetched successfully",
    };
  } catch (error) {
    console.log(error.message);

    return {
      statusCode: 500,
      availableVehicles: [],
      message: "Error fetching vehicles",
    };
  }
});
