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

    // Filter out vehicles with conflicting bookings
    const availableVehicles = vehicles.filter((bike) => {
      return !bike.bookings.some((booking) => {
        const bookingStart = dayjs(booking.start.toDate());
        const bookingEnd = dayjs(booking.end.toDate());
        return (
          pickupDate.isBefore(bookingEnd) && dropoffDate.isAfter(bookingStart)
        );
      });
    });

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
