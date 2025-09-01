import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./ListingPage.module.css";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLocation } from "react-router-dom";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  TextField,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
// import { BikesData } from "../assets/BikesData";
import ListingCard from "../components/ListingCard/ListingCard";
import Footer from "../components/Footer/Footer";
import FilterModal from "../components/FilterModal/FilterModal";
import { notification } from "antd";
import PageLoader from "../components/PageLoader/PageLoader";
import { getFunctions, httpsCallable } from "firebase/functions";
import { BrandOptions } from "../assets/FilterData";
import { BikeCategory } from "../assets/BikeCategory";
import { Helmet } from "react-helmet-async";

const ListingPage = () => {
  const [vehiclesData, setVehiclesData] = useState([]);
  const transmissionType = new URLSearchParams(window.location.search).get(
    "transmissionType"
  );
  const location = useLocation();
  const pageUrl = `https://fastfinite.in${location.pathname}${location.search}`;
  const [pickupDate, setPickupDate] = useState(
    dayjs().startOf("hour").add(1, "hour")
  );
  const [dropoffDate, setDropoffDate] = useState(pickupDate.add(1, "hour"));
  const [duration, setDuration] = useState("daily");

  const [transmission, setTransmission] = useState({
    // all: !transmissionType,
    petrolScooter: transmissionType === "petrolScooter",
    eScooter: transmissionType === "eScooter",
    petrolBike: transmissionType === "petrolBike",
    premiumBike: transmissionType === "premiumBike",
  });

  const [brands, setBrands] = useState({
    Honda: false,
    Vespa: false,
    Aprilia: false,
    Kawasaki: false,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(700));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTransmissionChange = (event) => {
    setTransmission({
      ...transmission,
      [event.target.name]: event.target.checked,
    });
  };

  const handleBrandsChange = (event) => {
    setBrands({
      ...brands,
      [event.target.name]: event.target.checked,
    });
  };

  const handlePickupDateChange = (newValue) => {
    const ceiledDate = newValue.startOf("hour");
    setPickupDate(ceiledDate);

    setDropoffDate((currentDropoffDate) => {
      const updatedPickupDate = ceiledDate;
      let newDropoffDate = currentDropoffDate;

      if (
        currentDropoffDate.diff(updatedPickupDate, "hour") < 1 ||
        updatedPickupDate.isAfter(currentDropoffDate)
      ) {
        newDropoffDate = updatedPickupDate.add(1, "hour");
      }

      return newDropoffDate;
    });
  };

  const handleDropoffDateChange = (newValue) => {
    // const ceiledDate = newValue.startOf("hour");
    setDropoffDate(newValue);
  };

  const handleDurationChange = (event) => {
    const newDuration = event.target.value;
    setDuration(newDuration);

    if (newDuration === "daily") {
      setDropoffDate(pickupDate.add(1, "day").startOf("hour"));
    } else if (newDuration === "weekly") {
      setDropoffDate(pickupDate.add(1, "week").startOf("hour"));
    } else if (newDuration === "monthly") {
      setDropoffDate(pickupDate.add(1, "month").startOf("hour"));
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);

    try {
      const filterVehicles = httpsCallable(getFunctions(), "filterVehicles");
      const res = await filterVehicles({
        pickupDate: pickupDate.toISOString(),
        dropoffDate: dropoffDate.toISOString(),
        transmission,
        brands,
      });

      const { statusCode, availableVehicles, message } = res.data;

      if (statusCode === 200) {
        setVehiclesData(availableVehicles);
        console.log(availableVehicles);
      } else {
        notification["error"]({
          message: `${message}`,
          duration: 3,
        });
      }
    } catch (error) {
      console.log(error);
      notification["error"]({
        message: `Error`,
        duration: 3,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchVehiclesData = async () => {
      await fetchVehicles();
    };

    fetchVehiclesData();
  }, []);

  const FILTER = () => {
    return (
      <div>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Booking Duration</FormLabel>
          <RadioGroup
            aria-label="booking-duration"
            name="booking-duration"
            value={duration}
            onChange={handleDurationChange}
          >
            <FormControlLabel
              value="daily"
              control={<Radio />}
              label="Daily Package"
            />
            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label="Weekly Package"
            />
            <FormControlLabel
              value="monthly"
              control={<Radio />}
              label="Monthly Package"
            />
          </RadioGroup>
        </FormControl>
        <Divider />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Transmission Type</FormLabel>
          {BikeCategory.map((item) => (
            <FormControlLabel
              key={item.transmissionType}
              control={
                <Checkbox
                  checked={transmission[item.transmissionType]}
                  onChange={handleTransmissionChange}
                  name={item.transmissionType}
                />
              }
              label={item.name}
            />
          ))}
        </FormControl>
        <Divider />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Brands</FormLabel>
          {BrandOptions.map((brand) => (
            <FormControlLabel
              key={brand.name}
              control={
                <Checkbox
                  checked={brands[brand.name]}
                  onChange={handleBrandsChange}
                  name={brand.name}
                />
              }
              label={brand.label}
            />
          ))}
        </FormControl>

        <button className={styles.apply} onClick={fetchVehicles}>
          Apply
        </button>
      </div>
    );
  };

  return (
    <Wrapper>
      <Helmet>
        <title>Available Bikes & Scooters for Rent | Fast Finite Kolkata</title>
        <meta
          name="description"
          content="Browse and book from a wide range of bikes and scooters available for rent in Kolkata. Fast Finite offers petrol, electric, and premium bikes with flexible packages."
        />
        <meta
          name="keywords"
          content="bike rental Bangalore, scooter rental Kolkata, premium bike hire, electric scooter rent, Fast Finite rentals"
        />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Available Bikes & Scooters for Rent | Fast Finite"
        />
        <meta
          property="og:description"
          content="Choose from petrol bikes, electric scooters, and premium motorcycles. Book your ride today with Fast Finite Kolkata."
        />
        <meta
          property="og:image"
          content="https://fastfinite.in/og-image.jpg"
        />
        <meta property="og:url" content={pageUrl} />
      </Helmet>
      <Navbar />

      <div className={styles.mainContainer}>
        {isMobile ? (
          <>
            <div className={styles.filterContainer}>
              <h5 className={styles.heading}>Select Dates</h5>
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
                  />
                </div>
              </LocalizationProvider>

              <button className={styles.apply} onClick={fetchVehicles}>
                Apply
              </button>
            </div>

            <button className={styles.filterBtn} onClick={handleClickOpen}>
              Open Filters
            </button>
            <FilterModal open={open} onClose={handleClose}>
              <FILTER />
            </FilterModal>
          </>
        ) : (
          <div className={styles.filterContainer}>
            <h5 className={styles.heading}>Filters</h5>
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
                />
              </div>
            </LocalizationProvider>
            <FILTER />
          </div>
        )}

        <div className={styles.resultContainer}>
          {loading ? (
            <PageLoader />
          ) : (
            <>
              <h5 className={styles.heading}>
                Displaying {vehiclesData.length} available vehicles
              </h5>
              <div className={styles.cardContainer}>
                {vehiclesData.map((item, index) => (
                  <ListingCard
                    key={index}
                    vehicle={item}
                    pickUpDate={pickupDate}
                    dropOffDate={dropoffDate}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
};

export default ListingPage;
