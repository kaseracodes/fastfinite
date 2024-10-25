/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { Cashfree } from "cashfree-pg";
import { createTransport } from "nodemailer";
import Mailgen from "mailgen";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

export const fetchVehicle = onCall(async (data, context) => {
  const { id } = data.data;

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

export const filterVehicles = onCall(async (data, context) => {
  const { pickupDate, dropoffDate, transmission, brands } = data.data;
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
    const conflictingBookingsSnapshot1 = await bookingsRef
      .where("vehicle_id", "==", vehicle_id)
      .where("startTime", "<=", pickupDate)
      .where("endTime", ">=", pickupDate)
      .get();

    const conflictingBookingsSnapshot2 = await bookingsRef
      .where("vehicle_id", "==", vehicle_id)
      .where("startTime", "<=", dropoffDate)
      .where("endTime", ">=", dropoffDate)
      .get();

    if (
      conflictingBookingsSnapshot1.empty &&
      conflictingBookingsSnapshot2.empty
    ) {
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

    return {
      statusCode: 200,
      orderData: res.data,
      message: "Order created successfully",
    };
  } catch (error) {
    console.log(error);

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
    // console.log(res.data[0].payment_status);

    if (res.data && res.data[0] && res.data[0].payment_status === "SUCCESS") {
      await db.collection("bookings").add(bookingData);
      return {
        verificationStatusCode: 200,
        verified: res.data,
        verificationMessage: "Booking saved successfully",
      };
    } else {
      return {
        verificationStatusCode: 400,
        verified: null,
        verificationMessage: "Payment failed",
      };
    }
  } catch (error) {
    console.log(error);

    return {
      verificationStatusCode: 500,
      verified: null,
      verificationMessage: "Error verifying payment",
    };
  }
});

export const sendMail = onCall(async (data, context) => {
  const { name, email, vehicleName, pickupDate, dropoffDate, amount } =
    data.data;

  try {
    const config = {
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    };

    const transporter = createTransport(config);

    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Fast Finite",
        link: "https://fastfinite.in",
      },
    });

    const response = {
      body: {
        name: name,
        intro: "You have successfully booked your ride.",
        table: {
          data: [
            {
              Vehicle: vehicleName,
              Pickup: pickupDate,
              Dropoff: dropoffDate,
              Amount: amount,
            },
          ],
        },
        outro: "Thank You!",
      },
    };

    const mail = mailGenerator.generate(response);

    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Booking confirmation",
      html: mail,
    };

    await transporter.sendMail(message);
    return {
      statusCode: 200,
      message: "Confirmation mail sent",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Error sending confirmation mail. Contact us if necessary",
    };
  }
});

export const getBookings = onCall(async (data, context) => {
  const { uid } = data.data;

  try {
    const bookingsRef = db.collection("bookings");
    const bookingsSnapshot = await bookingsRef
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const bookings = await Promise.all(
      bookingsSnapshot.docs.map(async (doc) => {
        const bookingData = doc.data();
        const vehicleRef = db
          .collection("vehicles")
          .doc(bookingData.vehicle_id);
        const vehicleDoc = await vehicleRef.get();

        return {
          id: doc.id,
          ...bookingData,
          vehicleName: vehicleDoc.exists
            ? vehicleDoc.data().name
            : "Unknown Vehicle",
          vehicleImage: vehicleDoc.exists ? vehicleDoc.data().image : "",
        };
      })
    );

    return {
      statusCode: 200,
      bookings: bookings,
      message: "Bookings fetched successfully",
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      bookings: [],
      message: "Error fetching user bookings",
    };
  }
});