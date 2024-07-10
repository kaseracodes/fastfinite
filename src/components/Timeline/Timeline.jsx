import styles from "./Timeline.module.css";

const Timeline = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.centerLine}></div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>1</div>
          <h5 className={styles.title}>Find Your Ride</h5>
          <p className={styles.desc}>
            Enter the basic details like, city, pick up and drop date and time
            to choose from a list of available two - wheelers at your desired
            go- hub.
          </p>
        </section>
      </div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>2</div>
          <h5 className={styles.title}>Book Your Ride</h5>
          <p className={styles.desc}>
            Select your package and choose from the available payment options.
          </p>
        </section>
      </div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>3</div>
          <h5 className={styles.title}>Get Ready to Ride</h5>
          <p className={styles.desc}>
            You will receive all the ride details via message and email. Reach
            the pick up point in time and pay the security deposit (if
            applicable). Enjoy every moment of your ride.
          </p>
        </section>
      </div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>4</div>
          <h5 className={styles.title}>End Your Ride</h5>
          <p className={styles.desc}>
            Once you have had the time of your life, drop the vehicle at the
            same pick up point. Security deposit is refunded after checking for
            damages and challans (if any).
          </p>
        </section>
      </div>
    </div>
  );
};

export default Timeline;
