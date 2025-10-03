/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./DetailPage.module.css";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COLORS } from "../assets/constants";
import Footer from "../components/Footer/Footer";
import { calculateGST, calculateRent } from "../utils/Calculations";
// ADD: Import custom pricing functionality
import { calculateSegmentedPricing } from "../utils/CustomPricingSegmentation";
import PricingBreakdown from "../components/PricingBreakdown/PricingBreakdown";
import { notification } from "antd";
import PageLoader from "../components/PageLoader/PageLoader";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { load } from "@cashfreepayments/cashfree-js";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { BikeCategory } from "../assets/BikeCategory";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/userSlice";
import { formatDate } from "../utils/formatDate";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config"; // adjust to your firebase config path

// Fix for the marker not showing in production
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Card = ({ imagePath, heading, detail, textColor }) => {
  return (
    <div className={styles.cardContainer}>
      <img src={imagePath} />
      <div className={styles.innerCard}>
        <p className={styles.cardHeading}>{heading}</p>
        <p className={styles.cardDetail} style={{ color: textColor }}>
          {detail}
        </p>
      </div>
    </div>
  );
};

const Card2 = ({ imagePath, heading, detail, textColor }) => {
  return (
    <div className={styles.cardContainer2}>
      <img src={imagePath} />
      <p className={styles.cardHeading}>{heading}</p>
      <p className={styles.cardDetail} style={{ color: textColor }}>
        {detail}
      </p>
    </div>
  );
};

const DetailPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const { state } = useLocation();

  const pageUrl = `https://fastfinite.in${location.pathname}${location.search}`;
  let cashfree;
  const initializeSDK = async () => {
    cashfree = await load({
      // mode: "sandbox",
      mode: "production",
    });
  };
  initializeSDK();

  const user = useSelector((state) => state.userReducer.user);
  const [bike, setBike] = useState(null);
  const [category, setCategory] = useState("");
  const [pickupDate, setPickupDate] = useState(
    dayjs(query.get("pickUpDate")) || dayjs().startOf("hour").add(1, "hour")
  );
  const [dropoffDate, setDropoffDate] = useState(
    dayjs(query.get("dropOffDate")) || pickupDate.add(1, "hour")
  );
  const [prevPickupDate, setPrevPickupDate] = useState(pickupDate);
  const [prevDropoffDate, setPrevDropoffDate] = useState(dropoffDate);
  const [duration, setDuration] = useState(query.get("duration") || "daily");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingsEnabled, setBookingsEnabled] = useState(true);
const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {}, [user]);
  useEffect(() => {
    const ref = doc(db, "settings", "global");
    // real-time subscription so admins toggling takes effect immediately
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setBookingsEnabled(Boolean(snap.data().bookingsEnabled));
        } else {
          // default if doc missing
          setBookingsEnabled(true);
        }
        setSettingsLoading(false);
      },
      (err) => {
        console.error("Failed to fetch settings:", err);
        setSettingsLoading(false);
      }
    );
  
    return () => unsub();
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (!authUser) {
        dispatch(logoutUser());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    setBike(state.vehicle);
    const transmissionType = BikeCategory.find(
      (item) => item.transmissionType === state.vehicle.type
    );
    setCategory(transmissionType);
  }, [state]);

  // ADD: Enhanced amount calculation with custom pricing
  const calculateSegmentedAmount = () => {
    if (!bike) return { rent: 0, gst: 0, total: 0, breakdown: [], hasCustomPricing: false };
    
    const pricingResult = calculateSegmentedPricing(
      pickupDate, 
      dropoffDate, 
      bike.package, 
      bike.type, 
      bike.customPricing
    );
    
    const gst = pricingResult.totalRent * 0.18;
    
    return {
      rent: pricingResult.totalRent,
      gst: gst,
      total: pricingResult.totalRent + gst,
      breakdown: pricingResult.breakdown,
      hasCustomPricing: pricingResult.hasCustomPricing
    };
  };

  const calculateAmount = () => {
    // return (
    //   calculateRent(pickupDate, dropoffDate, bike.package, bike.type) +
    //   calculateGST(pickupDate, dropoffDate, bike.package, bike.type) +
    //   Number(bike.package[duration].deposit)
    // );

    // UPDATED: Use segmented calculation for custom pricing
    const segmentedAmount = calculateSegmentedAmount();
    return segmentedAmount.total;
  };

  const handleScrollToTerms = (e) => {
    e.preventDefault();

    // Keep existing query params and navigate
    const currentSearch = location.search;
    navigate(`${currentSearch}#terms`, { replace: true, state });

    // Scroll to the 'terms' section
    const termsElement = document.getElementById("terms");
    if (termsElement) {
      termsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePickupDateChange = async (newValue) => {
    const ceiledDate = newValue.startOf("hour");
    setPrevPickupDate(pickupDate);
    setPickupDate(ceiledDate);

    setDropoffDate((currentDropoffDate) => {
      const updatedPickupDate = ceiledDate;
      let newDropoffDate = currentDropoffDate;
      let newDuration = "daily";

      if (
        currentDropoffDate.diff(updatedPickupDate, "hour") < 1 ||
        updatedPickupDate.isAfter(currentDropoffDate)
      ) {
        newDropoffDate = updatedPickupDate.add(1, "day");
        setPrevDropoffDate(currentDropoffDate);
      } else {
        const diff = currentDropoffDate.diff(updatedPickupDate, "hour");
        if (
          diff < 24 &&
          (bike.type === "premiumBike" || state.vehicle.type === "premiumBike")
        ) {
          newDuration = "hourly";
        } else if (diff >= 1 && diff < 24 * 7) {
          newDuration = "daily";
        } else if (diff >= 24 * 7 && diff < 24 * 30) {
          newDuration = "weekly";
        } else if (diff >= 24 * 30) {
          newDuration = "monthly";
        }
      }

      setDuration(newDuration);
      return newDropoffDate;
    });

    await handleCheckAvailability(bike || state.vehicle);
  };

  const handleDropoffDateChange = async (newValue) => {
    const ceiledDate = newValue.startOf("hour");
    setPrevDropoffDate(dropoffDate);
    setDropoffDate(ceiledDate);

    setPickupDate((currentPickupDate) => {
      const updatedDropoffDate = ceiledDate;
      const diff = updatedDropoffDate.diff(currentPickupDate, "hour");
      let newDuration = "daily";

      if (
        diff < 24 &&
        (bike.type === "premiumBike" || state.vehicle.type === "premiumBike")
      ) {
        newDuration = "hourly";
      } else if (diff >= 1 && diff < 24 * 7) {
        newDuration = "daily";
      } else if (diff >= 24 * 7 && diff < 24 * 30) {
        newDuration = "weekly";
      } else if (diff >= 24 * 30) {
        newDuration = "monthly";
      }

      setDuration(newDuration);
      return currentPickupDate;
    });

    await handleCheckAvailability(bike || state.vehicle);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);

    if (duration === "daily") {
      setDropoffDate(pickupDate.add(1, "day").startOf("hour"));
    } else if (duration === "weekly") {
      setDropoffDate(pickupDate.add(1, "week").startOf("hour"));
    } else if (duration === "monthly") {
      setDropoffDate(pickupDate.add(1, "month").startOf("hour"));
    }
  };

  const handleCheckAvailability = async (bike) => {
    if (!bike) return false;

    const currDateTime = dayjs().startOf("hour").add(1, "hour");

    if (currDateTime.isAfter(pickupDate)) {
      notification["error"]({
        message: `Please select valid pick up and drop off dates`,
        duration: 3,
      });
      setPickupDate(currDateTime);
      setDropoffDate(currDateTime.add(1, "hour"));
      return false;
    }

    const checkAvailability = httpsCallable(
      getFunctions(),
      "checkAvailability"
    );
    const res = await checkAvailability({
      pickupDate,
      dropoffDate,
      vehicle_id: bike.vehicle_id,
    });
    const { isAvailable, message } = res.data;

    if (!isAvailable) {
      notification["error"]({
        message: `${message}`,
        duration: 3,
      });

      setPickupDate(prevPickupDate);
      setDropoffDate(prevDropoffDate);
      return false;
    }

    notification["success"]({
      message: `Vehicle is available`,
      duration: 3,
    });
    return true;
  };

  const handleCreateOrder = async () => {
    const createOrder = httpsCallable(getFunctions(), "createOrder");
    const res = await createOrder({
      amount: calculateAmount(),
      uid: user.uid,
      phoneNo: user.phoneNo,
      name: user.name,
      email: user.email,
    });

    const { statusCode, orderData, message } = res.data;

    if (statusCode !== 200) {
      notification["error"]({
        message: `${message}`,
        duration: 3,
      });
      return null;
    }

    return orderData;
  };

  // const handleSendMail = async () => {
  //   const sendMail = httpsCallable(getFunctions(), "sendMail");
  //   const res = await sendMail({
  //     name: user.name,
  //     email: user.email,
  //     vehicleName: bike.name,
  //     pickupDate: formatDate(pickupDate.toISOString()),
  //     dropoffDate: formatDate(dropoffDate.toISOString()),
  //     amount: calculateAmount(),
  //   });
  //   const { statusCode, message } = res.data;

  //   let status = statusCode === 200 ? "success" : "error";
  //   notification[status]({
  //     message: message,
  //     duration: 3,
  //   });
  // };

  // const handleSendMailToAdmin = async () => {
  //   const sendMail = httpsCallable(getFunctions(), "sendMail");
  //   const res = await sendMail({
  //     name: "Fast Finite",
  //     email: "support@fastfinite.in",
  //     vehicleName: bike.name,
  //     pickupDate: formatDate(pickupDate.toISOString()),
  //     dropoffDate: formatDate(dropoffDate.toISOString()),
  //     amount: calculateAmount(),
  //   });
  //   const { statusCode, message } = res.data;

  //   let status = statusCode === 200 ? "success" : "error";
  //   notification[status]({
  //     message: message,
  //     duration: 3,
  //   });
  // };

  const handlePayment = async (e) => {
    e.preventDefault();
    // const f = true;

    // if (f) {
    //   notification["info"]({
    //     message: `Booking is disabled till 13th October, 2024`,
    //     duration: 3,
    //   });
    //   return;
    // }

    if (!isChecked) {
      notification["error"]({
        message: `Please accept the terms and conditions`,
        duration: 3,
      });
      return;
    }
    if (!bookingsEnabled) {
      notification["error"]({
        message: `Bookings are temporarily disabled. Please try later.`,
        duration: 4,
      });
      return;
    }
    if (!user) {
      notification["error"]({
        message: `Please login before booking your ride`,
        duration: 3,
      });
      return;
    }

    setLoading(true);

    try {
      // const f = true;
      // await handleSendMail();
      // if (f) return;

      const isAvailable = await handleCheckAvailability(bike || state.vehicle);
      if (!isAvailable) {
        setLoading(false);
        return;
      }

      const orderData = await handleCreateOrder();
      if (!orderData) {
        setLoading(false);
        return;
      }

      console.log(orderData);
      let checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_modal",
      };

      await cashfree.checkout(checkoutOptions);

      const verifyPayment = httpsCallable(getFunctions(), "verifyPayment");
      const verificationRes = await verifyPayment({
        bikeId: params.id,
        uid: user.uid,
        orderId: orderData.order_id,
        pickupDate: pickupDate.toISOString(),
        dropoffDate: dropoffDate.toISOString(),
        amount: calculateAmount(),
        deposit: bike.package[duration].deposit,
        createdAt: orderData.created_at,
      });
      const { verificationStatusCode, verificationMessage } =
        verificationRes.data;

      if (verificationStatusCode === 200) {
        notification["success"]({
          message: `Payment verified. Booked your ride successfully`,
          duration: 3,
        });
        setLoading(false);

        // await handleSendMail();
        // await handleSendMailToAdmin(); Not using this one now, changed in the cloud function
      } else {
        notification["error"]({
          message: `${verificationMessage}`,
          duration: 3,
        });
      }
    } catch (error) {
      console.error(error);
      notification["error"]({
        message: `Payment failed. Please try again.`,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // ADD: Get the pricing details for display
  const pricingDetails = bike ? calculateSegmentedAmount() : null;

  return (
    
    <Wrapper>
{bike && (
  <Helmet>
    <title>{`${bike.name} Rental in Kolkata | Fast Finite`}</title>
    <meta
      name="description"
      content={`Rent the ${bike.name} in Kolkata with Fast Finite. ${bike.mileage ? `Mileage: ${bike.mileage} kmpl.` : ""} ${bike.displacement ? `Displacement: ${bike.displacement}cc.` : ""} Book online today.`}
    />
    <meta
      name="keywords"
      content={`${bike.name} rental Kolkata, ${bike.name} rent Kolkata, ${bike.type} hire, premium bike rental India`}
    />
    <link rel="canonical" href={pageUrl} />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={`${bike.name} Rental in Kolkata | Fast Finite`} />
    <meta
      property="og:description"
      content={`Book ${bike.name} with Fast Finite. Affordable ${bike.type} rentals in Kolkata with flexible packages.`}
    />
    <meta property="og:image" content={bike.image || "https://fastfinite.in/og-image.jpg"} />
    <meta property="og:url" content={pageUrl} />

    {/* ✅ JSON-LD Structured Data for Product (Bike Rental) */}
    <script type="application/ld+json">
      {`
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "${bike.name}",
        "image": "${bike.image}",
        "description": "Rent the ${bike.name} in Kolkata with Fast Finite. ${bike.mileage ? `Mileage: ${bike.mileage} kmpl.` : ""} ${bike.displacement ? `Displacement: ${bike.displacement}cc.` : ""}",
        "brand": { "@type": "Brand", "name": "Fast Finite" },
        "sku": "${bike.vehicle_id}",
        "offers": {
          "@type": "Offer",
          "url": "${window.location.href}",
          "priceCurrency": "INR",
          "price": "${calculateAmount()}",
          "availability": "https://schema.org/InStock"
        }
      }
      `}
    </script>
  </Helmet>
)}
      <Navbar />
      {bike ? (
        <>
          <div className={styles.div1}>
            <div className={styles.imageDiv}>
              {category && (
                <div
                  className={
                    category.transmissionType === "premiumBike"
                      ? styles.specialType
                      : styles.type
                  }
                >
                  {category.transmissionType === "premiumBike" ? (
                    <img src="/images/icons/bike.png" alt="icon" />
                  ) : (
                    <img src="/images/icons/scooter.png" alt="icon" />
                  )}
                  {category.name}
                </div>
              )}

              <img src={bike.image} alt="image" className={styles.bikeImage} />

              <p className={styles.para}>
                *Images are for representation purposes only.
              </p>
              {/* <div className={styles.infoCardDiv}>
                <Card
                  imagePath="/images/mileage.png"
                  heading="Mileage"
                  detail={bike.mileage}
                  textColor={COLORS.yellow}
                />
                <Card
                  imagePath="/images/make_year.png"
                  heading="Make Year"
                  detail={bike.make_year}
                  textColor={COLORS.yellow}
                />
              </div> */}
            </div>

            <div className={styles.detailsDiv}>
              {!bookingsEnabled && (
                <div role="status" aria-live="polite" className={styles.bookingsStopped}>
                  <span className={styles.icon} aria-hidden>❌</span>
                  <div>
                    Bookings are currently stopped.
                    <br />
                    Please check back later. Thanks for visiting us!
                  </div>
                </div>
              )}
              <h5 className={styles.title}>{bike.name}</h5>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className={styles.dateInputContainer}>
                  <DateTimePicker
                    label="Pickup Date & Time"
                    value={pickupDate}
                    disabled={!bookingsEnabled}
                    onChange={handlePickupDateChange}
                    renderInput={(props) => (
                      <TextField {...props} fullWidth margin="normal" />
                    )}
                    shouldDisableTime={(timeValue) => timeValue.minute() !== 0}
                    minDateTime={dayjs().startOf("hour").add(1, "hour")}
                    views={["year", "month", "day", "hours"]}
                    // disabled
                  />
                  <DateTimePicker
                    label="Dropoff Date & Time"
                    value={dropoffDate}
                    onChange={handleDropoffDateChange}
                    renderInput={(props) => (
                      <TextField {...props} fullWidth margin="normal" />
                    )}
                    shouldDisableTime={(timeValue) => timeValue.minute() !== 0}
                    minDateTime={pickupDate.add(1, "hour")}
                    views={["year", "month", "day", "hours"]}
                    // disabled
                  />
                </div>
              </LocalizationProvider>

              {/* <p className={styles.filterHeading}>Select Package</p>
              <select
                name="package"
                value={duration}
                className={styles.select}
                onChange={handleDurationChange}
                disabled
              >
                <option value="hourly">Hourly Package</option>
                <option value="daily">Daily Package</option>
                <option value="weekly">Weekly Package</option>
                <option value="monthly">Monthly Package</option>
              </select> */}

              <p className={styles.filterHeading}>Fair Details</p>
              <hr className={styles.hr} />

              {/* ADD: Enhanced pricing breakdown */}
              {pricingDetails && <PricingBreakdown pricingDetails={pricingDetails} />}

              <p className={styles.amountText}>Total</p>
              <div className={styles.amountDiv}>
                <p className={styles.amountText}>Rent Amount</p>
                <p className={styles.amountText}>
                  ₹{" "}
                  {pricingDetails ? pricingDetails.rent : calculateRent(
                    pickupDate,
                    dropoffDate,
                    bike.package,
                    bike.type
                  )}
                </p>
              </div>

              <div className={styles.amountDiv}>
                <p className={styles.amountText}>GST (18%)</p>
                <p className={styles.amountText}>
                  ₹{" "}
                  {pricingDetails ? pricingDetails.gst : calculateGST(
                    pickupDate,
                    dropoffDate,
                    bike.package,
                    bike.type
                  )}
                </p>
              </div>

              {/* <div className={styles.amountDiv}>
                <p className={styles.amountText}>Refundable Deposit</p>
                <p className={styles.amountText}>
                  ₹ {bike.package[duration].deposit}
                </p>
              </div> */}
              <hr className={styles.hr} />

              <div className={styles.amountDiv}>
                <p className={styles.amountText2}>Amount Payable Today</p>
                <p className={styles.amountText2}>₹ {calculateAmount()}</p>
              </div>

              <button className={styles.btn1}>
                Refundable Deposit - ₹ {bike.package[duration].deposit} (To be
                paid at the time of pickup and refunded at the time of dropoff)
              </button>

              <div className={styles.checkbox}>
                <input
                  className={styles.amountText}
                  type="checkbox"
                  name="checkbox"
                  checked={isChecked}
                  disabled={!bookingsEnabled}
                  onChange={() => setIsChecked(event.target.checked)}
                />
                <label htmlFor="checkbox">
                  I agree to{" "}
                  <Link
                    onClick={handleScrollToTerms}
                    style={{ textDecoration: "none" }}
                  >
                    terms and conditions
                  </Link>
                </label>
              </div>

              <button
  className={styles.btn2}
  onClick={handlePayment}
  disabled={!bookingsEnabled || loading}
>
  {loading ? <BeatLoader color={COLORS.black} size={18} /> :
    (bookingsEnabled ? "Book Now" : "Bookings Disabled")}
</button>
            </div>
          </div>

          <div className={styles.div3}>
            <h5 className={styles.title}>Bike Features</h5>
            <div className={styles.featureDiv}>
              {bike.displacement && (
                <Card2
                  imagePath="/images/engine.png"
                  heading="Displacement"
                  detail={bike.displacement + " cc"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.top_speed && (
                <Card2
                  imagePath="/images/speed.png"
                  heading="Top Speed"
                  detail={bike.top_speed + " kmph"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.kerb_weight && (
                <Card2
                  imagePath="/images/weight.png"
                  heading="Kerb Weight"
                  detail={bike.kerb_weight + " kg"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.fuel_tank_capacity && (
                <Card2
                  imagePath="/images/fuel.png"
                  heading="Fuel Capacity"
                  detail={bike.fuel_tank_capacity + " L"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.seats && (
                <Card2
                  imagePath="/images/seat.png"
                  heading="Seats"
                  detail={bike.seats + " seater"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.mileage && (
                <Card2
                  imagePath="/images/speed.png"
                  heading="Mileage"
                  detail={bike.mileage + " kmpl"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.range && (
                <Card2
                  imagePath="/images/speed.png"
                  heading="Range"
                  detail={bike.range + " km"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.battery_capacity && (
                <Card2
                  imagePath="/images/speed.png"
                  heading="Battery Capacity"
                  detail={bike.battery_capacity + " kWhr"}
                  textColor={COLORS.gold}
                />
              )}

              {bike.charging_time && (
                <Card2
                  imagePath="/images/speed.png"
                  heading="Charging Time"
                  detail={bike.charging_time + " hr"}
                  textColor={COLORS.gold}
                />
              )}
            </div>
          </div>

          <div className={styles.div2} id="terms">
            <div className={styles.termsDiv}>
              <p className={styles.subHeading}>Terms & Conditions</p>

              <ul>
                <li className={styles.para2}>
                  Documents Required - Aadhar Card, Driving License and
                  Student/Employee ID Card.
                </li>

                <li className={styles.para2}>
                  One government address proof has to be submitted at the time
                  of pickup which will be returned at the time of drop off. The
                  riders needs to show all the original documents at the time of
                  pickup.
                </li>

                <li className={styles.para2}>
                  Fuel Charges are not included in the security deposit or rent.
                </li>

                <li className={styles.para2}>
                  In case of any damage to the vehicle, the customer is liable
                  to pay the repair charges plus the labour charges as per the
                  Authorised Service Center.
                </li>

                <li className={styles.para2}>
                  Charges to be borne by the customer - <br />
                  &emsp;&emsp;Helmet Lost: Rs. 700
                  <br />
                  &emsp;&emsp;Key Lost: Rs.1000
                  <br />
                  &emsp;&emsp;Full Insurance Declared Value of the vehicle in
                  case of any theft.
                </li>

                <li className={styles.para2}>Late fee: 150/hr</li>
              </ul>
            </div>

            <div className={styles.map}>
  <h5 className={styles.title}>Pickup Location</h5>
  <p className={styles.location}>{bike.location}</p>

  {bike?.position && bike?.position.lat && bike?.position.lng ? (
    <MapContainer
      center={bike.position}
      zoom={13}
      className={styles.mapContainer}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={bike.position}>
        <Popup>{bike.location || "Pickup Location"}</Popup>
      </Marker>
    </MapContainer>
  ) : (
    <p style={{ padding: "1rem", color: "gray" }}>
      Pickup location not available
    </p>
  )}
</div>
          </div>
        </>
      ) : (
        <PageLoader />
      )}

      <Footer />
    </Wrapper>
   
  );
};

export default DetailPage;
