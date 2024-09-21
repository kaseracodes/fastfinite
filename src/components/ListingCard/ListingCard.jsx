/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import styles from "./ListingCard.module.css";
import { IoLocationOutline } from "react-icons/io5";
import { calculateGST, calculateRent } from "../../utils/Calculations";
import { useEffect, useState } from "react";
import { BikeCategory } from "../../assets/BikeCategory";

const ListingCard = ({ vehicle, pickUpDate, dropOffDate }) => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState("daily");
  const category = BikeCategory.find(
    (item) => item.transmissionType === vehicle.type
  );

  useEffect(() => {
    const diff = dropOffDate.diff(pickUpDate, "hour");
    let newDuration = "daily";
    if (diff < 24 && vehicle.type === "premium") {
      newDuration = "hourly";
    } else if (diff >= 1 && diff < 24 * 7) {
      newDuration = "daily";
    } else if (diff >= 24 * 7 && diff < 24 * 30) {
      newDuration = "weekly";
    } else if (diff >= 24 * 30) {
      newDuration = "monthly";
    }
    setDuration(newDuration);
  }, [pickUpDate, dropOffDate, vehicle]);

  return (
    <div
      className={styles.container}
      onClick={() =>
        navigate(
          `/vehicles/${vehicle.id}?pickUpDate=${pickUpDate}&dropOffDate=${dropOffDate}`,
          {
            state: {
              vehicle,
            },
          }
        )
      }
    >
      <div className={styles.imageDiv}>
        <img src={vehicle.image} className={styles.image} />

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
      </div>

      <div className={styles.infoDiv}>
        <div className={styles.nameDiv}>
          <h5 className={styles.name}>{vehicle.name}</h5>
          <p className={styles.para}>
            {vehicle.make_year} • {vehicle.mileage}
          </p>
        </div>

        <div className={styles.locationDiv}>
          <p className={styles.para}>Pickup At:</p>
          <p className={styles.location}>
            <IoLocationOutline /> {vehicle.pickup_point}
          </p>
        </div>
      </div>

      <div className={styles.bottomDiv}>
        <div className={styles.duration}>
          <button>Total Price</button>
        </div>

        <div className={styles.priceDiv}>
          <p className={styles.rent}>
            ₹{" "}
            {calculateRent(
              pickUpDate,
              dropOffDate,
              vehicle.package,
              vehicle.type
            ) +
              calculateGST(
                pickUpDate,
                dropOffDate,
                vehicle.package,
                vehicle.type
              )}
          </p>
          <p className={styles.deposit}>
            Deposit: ₹{vehicle.package[duration].deposit}
          </p>
        </div>
      </div>

      <button className={styles.btn}>Book Your Ride</button>
    </div>
  );
};

export default ListingCard;
