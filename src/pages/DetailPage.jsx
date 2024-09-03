/* eslint-disable react/prop-types */
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./DetailPage.module.css";
import { useEffect, useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COLORS } from "../assets/constants";
import Footer from "../components/Footer/Footer";
import { calculateRent } from "../utils/Calculations";
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
  const query = new URLSearchParams(useLocation().search);
  const { state } = useLocation();

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
  const [transmissionType, setTransmissionType] = useState("");
  const [pickupDate, setPickupDate] = useState(
    dayjs(query.get("pickUpDate")) || dayjs().startOf("hour").add(1, "hour")
  );
  const [dropoffDate, setDropoffDate] = useState(
    dayjs(query.get("dropOffDate")) || pickupDate.add(1, "hour")
  );
  const [prevPickupDate, setPrevPickupDate] = useState(pickupDate);
  const [prevDropoffDate, setPrevDropoffDate] = useState(dropoffDate);
  const [duration, setDuration] = useState(query.get("duration") || "daily");
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, [user]);

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
    setTransmissionType(transmissionType);
  }, [state]);

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
          (bike.type === "premium" || state.vehicle.type === "premium")
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
        (bike.type === "premium" || state.vehicle.type === "premium")
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
      amount:
        calculateRent(pickupDate, dropoffDate, bike.package, bike.type) +
        Number(bike.package[duration].deposit),
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

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!user) {
      notification["error"]({
        message: `Please login before booking your ride`,
        duration: 3,
      });
      return;
    }

    const currDateTime = dayjs().startOf("hour").add(1, "hour");

    if (currDateTime.isAfter(pickupDate)) {
      notification["error"]({
        message: `Please select valid pick up and drop off dates`,
        duration: 3,
      });
      setPickupDate(currDateTime);
      setDropoffDate(currDateTime.add(1, "hour"));
      return;
    }

    setLoading(true);

    try {
      const isAvailable = await handleCheckAvailability(bike || state.vehicle);
      if (!isAvailable) {
        return;
      }

      const orderData = await handleCreateOrder();
      if (!orderData) return;

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
        amount:
          calculateRent(pickupDate, dropoffDate, bike.package, bike.type) +
          Number(bike.package[duration].deposit),
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

  return (
    <Wrapper>
      <Navbar />
      {bike ? (
        <>
          <div className={styles.div1}>
            <div className={styles.imageDiv}>
              {transmissionType && (
                <div
                  className={
                    transmissionType === "premiumBike"
                      ? styles.specialType
                      : styles.type
                  }
                >
                  <img src="/images/icons/scooter.png" alt="icon" />
                  {transmissionType.name}
                </div>
              )}

              <img src={bike.image} alt="image" className={styles.bikeImage} />

              <p className={styles.para}>
                *Images are for representation purposes only.
              </p>
              <div className={styles.infoCardDiv}>
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
              </div>
            </div>

            <div className={styles.detailsDiv}>
              <h5 className={styles.title}>{bike.name}</h5>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className={styles.dateInputContainer}>
                  <DateTimePicker
                    label="Pickup Date & Time"
                    value={pickupDate}
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
              <p className={styles.amountText}>Total</p>
              <div className={styles.amountDiv}>
                <p className={styles.amountText}>Rent Amount</p>
                <p className={styles.amountText}>
                  ₹{" "}
                  {calculateRent(
                    pickupDate,
                    dropoffDate,
                    bike.package,
                    bike.type
                  )}
                </p>
              </div>

              <div className={styles.amountDiv}>
                <p className={styles.amountText}>Refundable Deposit</p>
                <p className={styles.amountText}>
                  ₹ {bike.package[duration].deposit}
                </p>
              </div>
              <hr className={styles.hr} />

              <div className={styles.amountDiv}>
                <p className={styles.amountText2}>Amount Payable Today</p>
                <p className={styles.amountText2}>
                  ₹{" "}
                  {calculateRent(
                    pickupDate,
                    dropoffDate,
                    bike.package,
                    bike.type
                  ) + Number(bike.package[duration].deposit)}
                </p>
              </div>

              <button className={styles.btn1}>
                Refundable Deposit - ₹ {bike.package[duration].deposit} (To be
                refunded at the time of dropoff)
              </button>

              <button className={styles.btn2} onClick={handlePayment}>
                {loading ? (
                  <BeatLoader color={COLORS.black} size={18} />
                ) : (
                  "Book Now"
                )}
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

          <div className={styles.div2}>
            <div className={styles.termsDiv}>
              <p className={styles.subHeading}>Terms & Conditions</p>

              <p className={styles.para2}>
                Documents Required:- Aadhar Card, Driving License and
                Student/Employee ID Card.
              </p>

              <p className={styles.para2}>
                One Govt address proof has to be submitted at the time of pickup
                which will be returned at the time of drop.The riders needs to
                present all the original documents at the time of pickup.
              </p>

              <p className={styles.para2}>
                Fuel Charges are not included in the security deposit or rent.
              </p>

              <p className={styles.para2}>
                In case of any damage to the vehicle, the customer is liable to
                pay the repair charges plus the labour charges as per the
                Authorised Service Center.
              </p>

              <p className={styles.para2}>
                Charges to be borne by the customer:- Helmet Lost: Rs. 700, Key
                Lost: Rs.1000, Full Insurance Declared Value of the vehicle in
                case of any theft.
              </p>

              <p className={styles.para2}>Late fee 150/hr</p>
            </div>

            <div className={styles.map}>
              <h5 className={styles.title}>Pickup Location</h5>
              <p className={styles.location}>{bike.location}</p>

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
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </MapContainer>
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
