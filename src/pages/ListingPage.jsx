import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./ListingPage.module.css";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { BikesData } from "../assets/BikesData";
import ListingCard from "../components/ListingCard/ListingCard";

const ListingPage = () => {
  const [pickupDate, setPickupDate] = useState(dayjs());
  const [dropoffDate, setDropoffDate] = useState(dayjs());
  const [duration, setDuration] = useState("daily");
  const [transmission, setTransmission] = useState({
    scooty: false,
    electricScooty: false,
    bikes: false,
  });
  const [brands, setBrands] = useState({
    honda: false,
  });

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

  return (
    <Wrapper>
      <Navbar />

      <div className={styles.mainContainer}>
        <div className={styles.filterContainer}>
          <h5 className={styles.heading}>FILTERS</h5>

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

          {/* <div>
            <h5>Booking Duration</h5>
            <div>
              <input type="radio" name="duration" value="daily" />
              <label htmlFor="daily">Daily</label>
            </div>

            <div>
              <input type="radio" name="duration" value="weekly" />
              <label htmlFor="weekly">Weekly</label>
            </div>

            <div>
              <input type="radio" name="duration" value="monthly" />
              <label htmlFor="monthly">Monthly</label>
            </div>
          </div> */}

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

        <div className={styles.resultContainer}>
          <h5 className={styles.heading}>Displaying 6 available bikes</h5>
          <div className={styles.cardContainer}>
            {BikesData.map((item, index) => (
              <ListingCard
                key={index}
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
    </Wrapper>
  );
};

export default ListingPage;
