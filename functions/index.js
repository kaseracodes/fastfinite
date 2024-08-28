/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import dayjs from "dayjs";
import { Cashfree } from "cashfree-pg";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

export const fetchVehicle = onCall(async (data, context) => {
  const { id } = data.data;
  //   console.log(id);
  //   console.log(typeof id);

  try {
    const vehicleRef = db.collection("vehicles").doc(id);
    const vehicleDoc = await vehicleRef.get();
    // console.log(vehicleDoc);

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

export const filterVehicles = onCall(async (data, context) => {
  const { pickupDate, dropoffDate, transmission, brands } = data.data;
  //   console.log("1: " + dayjs.isDayjs(pickupDate));
  //   console.log("2" + dropoffDate);
  //   console.log("3" + dayjs(pickupDate.$d));

  //   const updatedPickupDate = dayjs(pickupDate);
  //   const updatedDropoffDate = dayjs(dropoffDate);
  //   console.log(updatedPickupDate);
  const pickupDateObj = new Date(pickupDate);
  const dropoffDateObj = new Date(dropoffDate);

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
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
      });
    }

    // Filter out vehicles with conflicting bookings
    const availableVehicles = [];
    for (const vehicle of vehicles) {
      const vehicleBookings = bookingsMap[vehicle.id] || [];
      let isAvailable = true;
      for (const booking of vehicleBookings) {
        // if (
        //   (pickupDate.isBefore(booking.end) &&
        //     dropoffDate.isAfter(booking.start)) ||
        //   pickupDate.isSame(booking.start) ||
        //   pickupDate.isSame(booking.end) ||
        //   dropoffDate.isSame(booking.start) ||
        //   dropoffDate.isSame(booking.end)
        // ) {
        //   isAvailable = false;
        //   break;
        // }

        if (
          (pickupDateObj < booking.end && dropoffDateObj > booking.start) ||
          pickupDateObj.getTime() === booking.start.getTime() ||
          pickupDateObj.getTime() === booking.end.getTime() ||
          dropoffDateObj.getTime() === booking.start.getTime() ||
          dropoffDateObj.getTime() === booking.end.getTime()
        ) {
          // Conflict found: Vehicle is not available
          isAvailable = false;
        }
      }
      if (isAvailable) {
        availableVehicles.push(vehicle);
      }
    }

    // console.log(availableVehicles);

    return {
      statusCode: 200,
      availableVehicles,
      message: "Fetched successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      availableVehicles: [],
      message: "Error fetching vehicles",
    };
  }
});

export const checkAvailability = onCall(async (data, context) => {
  const { pickupDate, dropoffDate, vehicle_id } = data.data;

  try {
    const bookingsRef = db.collection("bookings");
    const conflictingBookingsSnapshot = await bookingsRef
      .where("vehicle_id", "==", vehicle_id)
      .where("startTime", "<=", dropoffDate)
      .where("endTime", ">=", pickupDate)
      .get();

    if (conflictingBookingsSnapshot.empty) {
      return {
        statusCode: 200,
        isAvailable: true,
        message: "Vehicle is available in the given time range",
      };
    } else {
      return {
        statusCode: 400,
        isAvailable: false,
        message: "Vehicle is not available in the given time range",
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      isAvailable: false,
      message: "Error checking vehicle availability",
    };
  }
});

export const createOrder = onCall(async (data, context) => {
  const { amount, uid, phoneNo, name, email } = data.data;

  const request = {
    order_amount: Number(amount),
    order_currency: "INR",
    customer_details: {
      customer_id: uid,
      customer_phone: phoneNo,
      customer_name: name,
      customer_email: email,
    },
  };

  try {
    const res = await Cashfree.PGCreateOrder("2023-08-01", request);
    console.log(res.data);
    return {
      statusCode: 200,
      orderData: res.data,
      message: "Order created successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      orderData: null,
      message: "Error creating order",
    };
  }
});

export const verifyPayment = onCall(async (data, context) => {
  const {
    bikeId,
    uid,
    orderId,
    pickupDate,
    dropoffDate,
    amount,
    deposit,
    createdAt,
  } = data.data;

  const bookingData = {
    vehicle_id: bikeId,
    uid,
    startTime: pickupDate,
    endTime: dropoffDate,
    amount,
    deposit,
    orderId,
    createdAt,
  };

  try {
    const res = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    await db.collection("bookings").add(bookingData);
    return {
      verificationStatusCode: 200,
      verified: res.data,
      verificationMessage: "Booking saved successfully",
    };
  } catch (error) {
    throw new https.HttpsError("unknown", error.message, error);
  }
});
