/* eslint-disable no-unused-vars */
import { https } from "firebase-functions";
import Razorpay from "razorpay";
import admin from "../firebaseAdmin/config";

const db = admin.firestore;

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY_ID",
  key_secret: "YOUR_RAZORPAY_KEY_SECRET",
});

export const createOrder = https.onCall(async (data, context) => {
  const { amount, receipt } = data;

  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    };
  } catch (error) {
    throw new https.HttpsError("unknown", error.message, error);
  }
});

export const verifyPaymentAndSaveBooking = https.onCall(
  async (data, context) => {
    const {
      bikeId,
      uid,
      pickupDate,
      dropoffDate,
      amount,
      deposit,
      paymentDetails,
    } = data;

    const bookingData = {
      bike_id: bikeId,
      uid,
      startTime: pickupDate,
      endTime: dropoffDate,
      amount,
      deposit,
      payment_id: paymentDetails.razorpay_payment_id,
      order_id: paymentDetails.razorpay_order_id,
      signature: paymentDetails.razorpay_signature,
    };

    try {
      await db.collection("bookings").add(bookingData);
      return { status: "success", message: "Booking saved successfully" };
    } catch (error) {
      throw new https.HttpsError("unknown", error.message, error);
    }
  }
);
