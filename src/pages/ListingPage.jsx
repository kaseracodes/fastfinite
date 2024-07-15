import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./ListingPage.module.css";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
import { BikesData } from "../assets/BikesData";
import ListingCard from "../components/ListingCard/ListingCard";
import Footer from "../components/Footer/Footer";
import FilterModal from "../components/FilterModal/FilterModal";

const ListingPage = () => {
  const transmissionType = new URLSearchParams(window.location.search).get(
    "transmissionType"
  );
  const [pickupDate, setPickupDate] = useState(
    dayjs().startOf("hour").add(1, "hour")
  );
  const [dropoffDate, setDropoffDate] = useState(
    dayjs().startOf("hour").add(2, "hour")
  );
  const [duration, setDuration] = useState("daily");

  const [transmission, setTransmission] = useState({
    scooty: transmissionType === "scooty",
    electricScooty: transmissionType === "electricScooty",
    bikes: transmissionType === "bike",
  });
  const [brands, setBrands] = useState({
    honda: false,
  });
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(700));

  useEffect(() => {
    // Adjust drop-off date based on duration
    if (duration === "daily") {
      setDropoffDate(pickupDate.add(1, "day").startOf("hour"));
    } else if (duration === "weekly") {
      setDropoffDate(pickupDate.add(1, "week").startOf("hour"));
    } else if (duration === "monthly") {
      setDropoffDate(pickupDate.add(1, "month").startOf("hour"));
    }
  }, [pickupDate, duration]);

  useEffect(() => {
    // Adjust duration based on date difference
    const diff = dropoffDate.diff(pickupDate, "hour");
    if (diff >= 24 && diff < 24 * 7) {
      setDuration("daily");
    } else if (diff >= 24 * 7 && diff < 24 * 30) {
      setDuration("weekly");
    } else if (diff >= 24 * 30) {
      setDuration("monthly");
    }
  }, [dropoffDate, pickupDate]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
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
    const ceiledDate = newValue.startOf("hour").add(1, "hour");
    setPickupDate(ceiledDate);
  };

  const handleDropoffDateChange = (newValue) => {
    const ceiledDate = newValue.startOf("hour").add(1, "hour");
    setDropoffDate(ceiledDate);
  };

  const FILTER = () => {
    return (
      <div className={styles.filterContainer}>
        <h5 className={styles.heading}>FILTERS</h5>
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
            />
          </div>
        </LocalizationProvider>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={transmission.scooty}
                onChange={handleTransmissionChange}
                name="scooty"
              />
            }
            label="Scooty"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={transmission.electricScooty}
                onChange={handleTransmissionChange}
                name="electricScooty"
              />
            }
            label="Electric Scooty"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={transmission.bikes}
                onChange={handleTransmissionChange}
                name="bikes"
              />
            }
            label="Bikes"
          />
        </FormControl>
        <Divider />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Brands</FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={brands.honda}
                onChange={handleBrandsChange}
                name="honda"
              />
            }
            label="Honda"
          />
        </FormControl>
      </div>
    );
  };

  return (
    <Wrapper>
      <Navbar />

      <div className={styles.mainContainer}>
        {isMobile ? (
          <>
            <button className={styles.filterBtn} onClick={handleClickOpen}>
              Open Filters
            </button>
            <FilterModal open={open} onClose={handleClose}>
              <FILTER />
            </FilterModal>
          </>
        ) : (
          <FILTER />
        )}

        <div className={styles.resultContainer}>
          <h5 className={styles.heading}>Displaying 6 available bikes</h5>
          <div className={styles.cardContainer}>
            {BikesData.map((item, index) => (
              <ListingCard
                key={index}
                id={item.id}
                imagePath={item.imagePath}
                name={item.name}
                year={item.year}
                mileage={item.mileage}
                location={item.location}
                rent={item.rent}
                deposit={item.deposit}
                duration="Monthly"
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
};

export default ListingPage;
