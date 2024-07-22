/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "./ListingCard.module.css";
import { IoLocationOutline } from "react-icons/io5";

const ListingCard = ({
  id,
  name,
  imagePath,
  year,
  mileage,
  location,
  rent,
  deposit,
  duration,
}) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container} onClick={() => navigate(`/bikes/${id}`)}>
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
          <button>Total Price</button>
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
