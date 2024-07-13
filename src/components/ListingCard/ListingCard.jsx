/* eslint-disable react/prop-types */
import styles from "./ListingCard.module.css";
import { IoLocationOutline } from "react-icons/io5";

const ListingCard = ({
  name,
  imagePath,
  year,
  mileage,
  location,
  rent,
  deposit,
  duration,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageDiv}>
        <img src={imagePath} />
      </div>

      <div className={styles.infoDiv}>
        <div className={styles.nameDiv}>
          <h5 className={styles.name}>{name}</h5>
          <p className={styles.para}>
            {year} • {mileage}
          </p>
        </div>

        <div className={styles.locationDiv}>
          <p className={styles.para}>Pickup At:</p>
          <p className={styles.location}>
            <IoLocationOutline /> {location}
          </p>
        </div>
      </div>

      <div className={styles.bottomDiv}>
        <div className={styles.duration}>
          <button>{duration}</button>
        </div>

        <div className={styles.priceDiv}>
          <p className={styles.rent}>₹ {rent}</p>
          <p className={styles.deposit}>Deposit: ₹{deposit}</p>
        </div>
      </div>

      <button className={styles.btn}>Book Your Ride</button>
    </div>
  );
};

export default ListingCard;
