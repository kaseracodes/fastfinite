/* eslint-disable react/prop-types */
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./DetailPage.module.css";
import { useEffect, useState } from "react";
import { BikesData } from "../assets/BikesData";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { COLORS } from "../assets/constants";
import Footer from "../components/Footer/Footer";

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

const DetailPage = () => {
  const params = useParams();
  const [bike, setBike] = useState(null);
  const [pickupDate, setPickupDate] = useState(dayjs());
  const [dropoffDate, setDropoffDate] = useState(dayjs());

  useEffect(() => {
    setBike(BikesData.find((obj) => obj.id === params.id));
  }, []);

  return (
    <Wrapper>
      <Navbar />
      {bike && (
        <>
          <div className={styles.div1}>
            <div className={styles.imageDiv}>
              <img
                src={bike.imagePath}
                alt="image"
                className={styles.bikeImage}
              />

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
                  detail={bike.year}
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
                    onChange={(newValue) => setPickupDate(newValue)}
                    renderInput={(props) => (
                      <TextField {...props} fullWidth margin="normal" />
                    )}
                  />
                  <DateTimePicker
                    label="Dropoff Date & Time"
                    value={dropoffDate}
                    onChange={(newValue) => setDropoffDate(newValue)}
                    renderInput={(props) => (
                      <TextField {...props} fullWidth margin="normal" />
                    )}
                  />
                </div>
              </LocalizationProvider>

              <p className={styles.filterHeading}>Select Package</p>
              <select name="package" className={styles.select}>
                <option value="daily">Daily Package</option>
                <option value="weekly">Weekly Package</option>
                <option value="monthly">Monthly Package</option>
              </select>

              <p className={styles.filterHeading}>Fair Details</p>
              <hr className={styles.hr} />
              <p className={styles.amountText}>Total</p>
              <div className={styles.amountDiv}>
                <p className={styles.amountText}>Rent Amount</p>
                <p className={styles.amountText}>₹ {bike.rent}</p>
              </div>

              <div className={styles.amountDiv}>
                <p className={styles.amountText}>Refundable Deposit</p>
                <p className={styles.amountText}>₹ {bike.deposit}</p>
              </div>
              <hr className={styles.hr} />

              <div className={styles.amountDiv}>
                <p className={styles.amountText2}>Amount Payable Today</p>
                <p className={styles.amountText2}>
                  ₹ {Number(bike.rent) + Number(bike.deposit)}
                </p>
              </div>

              <button className={styles.btn1}>
                Refundable Deposit - ₹ {bike.deposit} (To be refunded at the
                time of dropoff)
              </button>

              <button className={styles.btn2}>Book Now</button>
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

          <div className={styles.div3}>
            <h5 className={styles.title}>Bike Features</h5>
            <div className={styles.featureDiv}>
              <Card
                imagePath="/images/engine.png"
                heading="Displacement"
                detail={bike.displacement}
                textColor={COLORS.gold}
              />

              <Card
                imagePath="/images/speed.png"
                heading="Top Speed"
                detail={bike.topSpeed}
                textColor={COLORS.gold}
              />

              <Card
                imagePath="/images/weight.png"
                heading="Kerb Weight"
                detail={bike.weight}
                textColor={COLORS.gold}
              />

              <Card
                imagePath="/images/fuel.png"
                heading="Fuel Capacity"
                detail={bike.fuelCapacity}
                textColor={COLORS.gold}
              />

              <Card
                imagePath="/images/seat.png"
                heading="Seats"
                detail={bike.seats}
                textColor={COLORS.gold}
              />

              <Card
                imagePath="/images/speed.png"
                heading="Mileage"
                detail={bike.mileage}
                textColor={COLORS.gold}
              />
            </div>
          </div>
        </>
      )}

      <Footer />
    </Wrapper>
  );
};

export default DetailPage;
