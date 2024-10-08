import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import dayjs from "dayjs";

const filterVehicles = async (
  pickupDate,
  dropoffDate,
  transmission,
  brands
) => {
  try {
    const vehiclesRef = collection(db, "vehicles");
    let vehiclesQuery = query(vehiclesRef);

    // Filter by transmission type if not 'all'
    // if (!transmission.all) {
    const transmissionFilters = Object.keys(transmission).filter(
      (key) => transmission[key]
    );

    if (transmissionFilters.length > 0) {
      vehiclesQuery = query(
        vehiclesQuery,
        where("type", "in", transmissionFilters)
      );
    }
    // }

    // Filter by brand if any are selected
    const selectedBrands = Object.keys(brands).filter((brand) => brands[brand]);
    if (selectedBrands.length > 0) {
      vehiclesQuery = query(
        vehiclesQuery,
        where("brand", "in", selectedBrands)
      );
    }

    // Fetch the vehicles
    const querySnapshot = await getDocs(vehiclesQuery);
    const vehicles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch all bookings
    const bookingsRef = collection(db, "bookings");
    const bookingsSnapshot = await getDocs(bookingsRef);
    const bookings = bookingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Rearrange bookings for every vehicles
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
          (pickupDate.isBefore(booking.end) &&
            dropoffDate.isAfter(booking.start)) ||
          pickupDate.isSame(booking.start) ||
          pickupDate.isSame(booking.end) ||
          dropoffDate.isSame(booking.start) ||
          dropoffDate.isSame(booking.end)
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
};

export default filterVehicles;
