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
import { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { BikesData } from "../assets/BikesData";
import ListingCard from "../components/ListingCard/ListingCard";
import Footer from "../components/Footer/Footer";
import FilterModal from "../components/FilterModal/FilterModal";
import { calculateRent } from "../utils/Calculations";

const ListingPage = () => {
  const transmissionType = new URLSearchParams(window.location.search).get(
    "transmissionType"
  );
  const [pickupDate, setPickupDate] = useState(
    dayjs().startOf("hour").add(1, "hour")
  );
  const [dropoffDate, setDropoffDate] = useState(
    dayjs().startOf("hour").add(1, "day").add(1, "hour")
  );
  const [duration, setDuration] = useState("daily");

  const [transmission, setTransmission] = useState({
    petrolScooter: transmissionType === "petrolScooter",
    eScooter: transmissionType === "eScooter",
    petrolBike: transmissionType === "petrolBike",
  });
  const [brands, setBrands] = useState({
    honda: false,
  });
  const [open, setOpen] = useState(false);
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
      let newDuration = "daily";

      if (
        currentDropoffDate.diff(updatedPickupDate, "hour") < 24 ||
        updatedPickupDate.isAfter(currentDropoffDate)
      ) {
        newDropoffDate = updatedPickupDate.add(1, "day");
      } else {
        const diff = currentDropoffDate.diff(updatedPickupDate, "hour");
        if (diff >= 24 && diff < 24 * 7) {
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
  };

  const handleDropoffDateChange = (newValue) => {
    const ceiledDate = newValue.startOf("hour");
    setDropoffDate(ceiledDate);

    setPickupDate((currentPickupDate) => {
      const updatedDropoffDate = ceiledDate;
      const diff = updatedDropoffDate.diff(currentPickupDate, "hour");
      let newDuration = "daily";

      if (diff >= 24 && diff < 24 * 7) {
        newDuration = "daily";
      } else if (diff >= 24 * 7 && diff < 24 * 30) {
        newDuration = "weekly";
      } else if (diff >= 24 * 30) {
        newDuration = "monthly";
      }

      setDuration(newDuration);
      return currentPickupDate;
    });
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
          <FormControlLabel
            control={
              <Checkbox
                checked={transmission.petrolScooter}
                onChange={handleTransmissionChange}
                name="petrolScooter"
              />
            }
            label="Petrol Scooter"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={transmission.eScooter}
                onChange={handleTransmissionChange}
                name="eScooter"
              />
            }
            label="E-Scooter"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={transmission.petrolBike}
                onChange={handleTransmissionChange}
                name="petrolBike"
              />
            }
            label="Petrol Bike"
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
                    minDateTime={pickupDate.add(1, "day")}
                    views={["year", "month", "day", "hours"]}
                  />
                </div>
              </LocalizationProvider>
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
                  minDateTime={pickupDate.add(1, "day")}
                  views={["year", "month", "day", "hours"]}
                />
              </div>
            </LocalizationProvider>
            <FILTER />
          </div>
        )}

        <div className={styles.resultContainer}>
          <h5 className={styles.heading}>Displaying 6 available bikes</h5>
          <div className={styles.cardContainer}>
            {BikesData.map((item, index) => (
              <ListingCard
                key={index}
                id={item.id}
                imagePath={item.image}
                name={item.name}
                year={item.make_year}
                mileage={item.mileage}
                location={item.pickup_point}
                rent={calculateRent(pickupDate, dropoffDate, item.package)}
                deposit={item.package[duration].deposit}
                duration={duration.toUpperCase()}
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
