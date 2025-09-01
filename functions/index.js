/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { Cashfree } from "cashfree-pg";
import { createTransport } from "nodemailer";
import Mailgen from "mailgen";
import { v4 as uuidv4 } from "uuid";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import fetch from "node-fetch";
import { generateInvoicePDF } from './invoiceGenerator.js';

if (admin.apps.length === 0) {
  admin.initializeApp({
    storageBucket: "fast-finite-bike-rental.appspot.com" // replace with your Firebase project bucket
  });
}

if (process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
  console.log("⚡ Using Firebase Storage Emulator at", process.env.FIREBASE_STORAGE_EMULATOR_HOST);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();


Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

const EMAIL = process.env.EMAIL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
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

        // ✅ Corrected overlap check (simplified & covers all cases)
        if (
          (pickupDateObj < booking.end && dropoffDateObj > booking.start) ||
          pickupDateObj.getTime() === booking.start.getTime() ||
          pickupDateObj.getTime() === booking.end.getTime() ||
          dropoffDateObj.getTime() === booking.start.getTime() ||
          dropoffDateObj.getTime() === booking.end.getTime()
        ) {
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

    if (conflictingBookingsSnapshot1.empty &&
      conflictingBookingsSnapshot2.empty) {
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
    console.error("Error checking availability:", error.message);
    return {
      statusCode: 500,
      isAvailable: false,
      message: "Error checking vehicle availability",
    };
  }
});

// PAYMENT FUNCTIONS COMMENTED OUT FOR TESTING
export const createOrder = onCall(async (data, context) => {
  const { amount, uid, phoneNo, name, email } = data.data;

  // // MOCK ORDER CREATION FOR TESTING
  // console.log("TESTING MODE: Skipping actual payment gateway");
  
  // // Generate a mock order ID for testing
  // const mockOrderId = `test_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // const mockOrderData = {
  //   order_id: mockOrderId,
  //   order_amount: Number(amount),
  //   order_currency: "INR",
  //   customer_details: {
  //     customer_id: uid,
  //     customer_phone: phoneNo,
  //     customer_name: name,
  //     customer_email: email,
  //   },
  //   order_status: "ACTIVE", // Mock status
  //   payment_session_id: `test_session_${Date.now()}`,
  // };

  // ORIGINAL PAYMENT CODE COMMENTED OUT
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
  

  // try {
  //   return {
  //     statusCode: 200,
  //     orderData: mockOrderData,
  //     message: "Mock order created successfully (TESTING MODE)",
  //   };
  // } catch (error) {
  //   console.log(error);
  //   return {
  //     statusCode: 500,
  //     orderData: null,
  //     message: "Error creating mock order",
  //   };
  // }
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

  // ✅ Ensure numeric values
  const bookingAmount = Number(amount) || 0;
  const bookingDeposit = Number(deposit) || 0;

  const bookingData = {
    vehicle_id: bikeId,
    uid,
    startTime: pickupDate,
    endTime: dropoffDate,
    amount: bookingAmount,
    deposit: bookingDeposit,
    orderId,
    createdAt,
  };

  try {
  //   // ✅ Step 1: Check for conflicting bookings again
  //   const bookingsRef = db.collection("bookings");
  //   const conflictingBookingsSnapshot = await bookingsRef
  //     .where("vehicle_id", "==", bikeId)
  //     .where("startTime", "<", dropoffDate)   // booking starts before requested drop
  //     .where("endTime", ">", pickupDate)      // booking ends after requested pickup
  //     .get();

  //   if (!conflictingBookingsSnapshot.empty) {
  //     return {
  //       verificationStatusCode: 409,
  //       verified: null,
  //       verificationMessage: "Vehicle already booked in the given time range",
  //     };
  //   }

  //   // ✅ Step 2: Verify payment with Cashfree
    const res = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

    if (res.data && res.data[0] && res.data[0].payment_status === "SUCCESS") {
      // const bookingData = {
      //   vehicle_id: bikeId,
      //   uid,
      //   startTime: pickupDate,
      //   endTime: dropoffDate,
      //   amount: bookingAmount,
      //   deposit: bookingDeposit,
      //   orderId,
      //   createdAt,
      // };

      // // ✅ Step 3: Save booking only if no conflicts
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


const RUPEE = "₹";

function getStorageUrl(fileName, downloadToken, projectId) {
  // Check if we're running in the Firebase Storage emulator
  if (process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
    // For emulator, use the local URL format
    const emulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
    return `http://${emulatorHost}/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
  } else {
    // For production, use the standard URL
    return `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
  }
}

export const onBookingCreated = onDocumentCreated("bookings/{bookingId}", async (event) => {
  const booking = event.data.data();
  const bookingId = event.params.bookingId;

  try {
    console.log(`🎨 Starting invoice generation for booking: ${bookingId}`);
    console.log(`📄 Booking data:`, booking);

    // --- Fetch user & vehicle data ---
    const userSnap = await db.collection("users").doc(booking.uid).get();
    const vehicleSnap = await db.collection("vehicles").doc(booking.vehicle_id).get();

    if (!userSnap.exists) {
      console.error(`❌ User not found: ${booking.uid}`);
      throw new Error("User not found for invoice");
    }
    if (!vehicleSnap.exists) {
      console.error(`❌ Vehicle not found: ${booking.vehicle_id}`);
      throw new Error("Vehicle not found for invoice");
    }

    const user = userSnap.data();
    const vehicle = vehicleSnap.data();

    const pdfBuffer = await generateInvoicePDF(booking, bookingId, user, vehicle);

    // --- Upload to Firebase Storage ---
    const downloadToken = uuidv4();
    const fileName = `invoices/inv-${bookingId}.pdf`;
    const file = bucket.file(fileName);

    console.log(`☁️ Uploading to storage: ${fileName}`);

    await file.save(pdfBuffer, {
      metadata: {
        contentType: "application/pdf",
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });

    console.log("☁️ File uploaded successfully");

    // Get the project ID more reliably
    const projectId = process.env.GCLOUD_PROJECT || admin.app().options.projectId || "fast-finite-bike-rental";
    const invoiceUrl = getStorageUrl(fileName, downloadToken, projectId);

    console.log("🔗 Generated invoice URL:", invoiceUrl);

    // --- UPDATE FIRESTORE DOCUMENT ---
    console.log(`📝 Updating booking document ${bookingId} with invoice URL`);
    
    // Use a transaction to ensure the update succeeds
    await db.runTransaction(async (transaction) => {
      const bookingRef = db.collection("bookings").doc(bookingId);
      const bookingDoc = await transaction.get(bookingRef);
      
      if (!bookingDoc.exists) {
        throw new Error(`Booking document ${bookingId} not found during update`);
      }
      
      transaction.update(bookingRef, { 
        invoiceUrl: invoiceUrl
      });
      
      console.log(`✅ Transaction committed for booking ${bookingId}`);
    });

    console.log("✅ Invoice generated and URL saved:", invoiceUrl);

    // Send notification after successful update
    try {
      await sendNotificationInternal({ uid: booking.uid, bookingId, invoiceUrl, pdfBuffer });
      console.log("📧 Notification sent successfully");
    } catch (notificationError) {
      console.error("📧 Notification failed (but invoice was saved):", notificationError);
    }

    return null;
  } catch (error) {
    console.error("❌ CRITICAL ERROR in invoice generation:", error);
    console.error("❌ Error stack:", error.stack);
    
    // Try to update the document with error status
    try {
      await db.collection("bookings").doc(bookingId).update({
        invoiceError: error.message,
        invoiceErrorAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (updateError) {
      console.error("❌ Failed to update error status:", updateError);
    }
    
    return null;
  }
});

const formatDateTimeIST = (date) => {
  const options = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  };
  return new Date(date).toLocaleString("en-IN", options);
};

async function sendNotificationInternal({ uid, bookingId, invoiceUrl, pdfBuffer }) {
  try {
    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) return;

    const { name, email } = userSnap.data();

    // Fetch booking and vehicle data for Mailgen content
    const bookingSnap = await db.collection("bookings").doc(bookingId).get();
    const booking = bookingSnap.data();
    const vehicleSnap = await db.collection("vehicles").doc(booking.vehicle_id).get();
    const vehicle = vehicleSnap.data();

    // Email transport config
    const transporter = createTransport({
      service: "gmail",
      auth: { user: EMAIL, pass: PASSWORD },
    });

    // ✅ Use Mailgen formatting
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
        intro: "🎉 Booking Confirmation",
        table: {
          data: [
            {
              Vehicle: vehicle.name,
              Pickup: formatDateTimeIST(booking.startTime),
              Dropoff: formatDateTimeIST(booking.endTime),
              Amount: `${RUPEE}${booking.amount}`,
              Status: "Confirmed",
            },
          ],
        },
        outro: "Thank you for booking with Fast Finite! Your invoice is attached below.",
      },
    };

    const mail = mailGenerator.generate(response);

    // ✅ Single email: confirmation + invoice attachment
    const message = {
      from: EMAIL,
      to: email,
      subject: "Booking Confirmation & Invoice",
      html: mail,
      attachments: [
        {
          filename: `invoice-${bookingId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    };

    await transporter.sendMail(message);
    console.log(`📩 Booking confirmation + invoice sent to ${email}`);

    const adminMessage = {
      ...message,
      to: ADMIN_EMAIL,  // overwrite receiver
      subject: `Admin Copy - Booking Confirmation (${bookingId})`
    };
    
    await transporter.sendMail(adminMessage);
    console.log(`📩 Booking confirmation + invoice also sent to admin ${ADMIN_EMAIL}`);

    // WhatsApp (still optional)
    const { phoneNo } = userSnap.data();
    if (phoneNo) {
      await sendWhatsAppMessageInternal({ phoneNo, name, invoiceUrl });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}


async function sendWhatsAppMessageInternal({ phoneNo, name, invoiceUrl }) {
  try {
    const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL; 
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
    const WHATSAPP_SENDER = process.env.WHATSAPP_SENDER; // e.g. phone number id

    const messageBody = {
      messaging_product: "whatsapp",
      to: phoneNo, // recipient's phone number in international format
      type: "text",
      text: {
        body: `Hello ${name}, your booking invoice is ready. Download here: ${invoiceUrl}`,
      },
    };

    const res = await fetch(`${WHATSAPP_API_URL}/${WHATSAPP_SENDER}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageBody),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("WhatsApp send error:", err);
    } else {
      console.log(`WhatsApp message sent to ${phoneNo}`);
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error);
  }
}

export const sendNotification = onCall(async (data, context) => {
  const { uid, bookingId, invoiceUrl } = data.data;

  await sendNotificationInternal({ uid, bookingId, invoiceUrl });

  return { statusCode: 200, message: "Notification sent" };
});

// export const sendMail = onCall(async (data, context) => {
//   const { name, email, vehicleName, pickupDate, dropoffDate, amount } =
//     data.data;

//   try {
//     const config = {
//       service: "gmail",
//       auth: {
//         user: EMAIL,
//         pass: PASSWORD,
//       },
//     };

//     const transporter = createTransport(config);

//     const mailGenerator = new Mailgen({
//       theme: "default",
//       product: {
//         name: "Fast Finite",
//         link: "https://fastfinite.in",
//       },
//     });

//     const response = {
//       body: {
//         name: name,
//         intro: "You have successfully booked your ride.",
//         table: {
//           data: [
//             {
//               Vehicle: vehicleName,
//               Pickup: pickupDate,
//               Dropoff: dropoffDate,
//               Amount: amount,
//             },
//           ],
//         },
//         outro: "Thank You!",
//       },
//     };

//     const mail = mailGenerator.generate(response);

//     const message = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Booking confirmation",
//       html: mail,
//     };

//     await transporter.sendMail(message);
//     return {
//       statusCode: 200,
//       message: "Confirmation mail sent",
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       statusCode: 500,
//       message: "Error sending confirmation mail. Contact us if necessary",
//     };
//   }
// });

export const sendMailByUser = onCall(async (data, context) => {
  const { name, email, subject, userMessage } = data.data;

  try {
    const config = {
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    };

    const transporter = createTransport(config);

    const mailContent =
      `<h3>From, ${name}</h3>` +
      `<h4>Mail id: ${email}</h4>` +
      `<p>${userMessage}</p>`;

    const mail = {
      from: email,
      to: EMAIL,
      subject: subject,
      html: mailContent,
    };

    await transporter.sendMail(mail);
    return {
      statusCode: 200,
      message: "Message sent",
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Error sending message.",
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
          testMode: false, // Set to true if using mock data
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