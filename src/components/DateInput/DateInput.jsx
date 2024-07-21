/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import styles from "./DateInput.module.css";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DateInput = ({
  pickupDate,
  dropoffDate,
  handlePickupDateChange,
  handleDropoffDateChange,
}) => {
  return (
    <div className={styles.container}>
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
            minDateTime={pickupDate.add(1, "day")}
          />
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default DateInput;
