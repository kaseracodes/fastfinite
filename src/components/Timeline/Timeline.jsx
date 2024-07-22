import styles from "./Timeline.module.css";

const Timeline = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.centerLine}></div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>1</div>
          <h5 className={styles.title}>Choose Your Ride</h5>
          <p className={styles.desc}>
            Select your desired two-wheeler according to your needs and
            preferences.
          </p>
        </section>
      </div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>2</div>
          <h5 className={styles.title}>Book Your Ride</h5>
          <p className={styles.desc}>
            Select your package and your preferred payment option.
          </p>
        </section>
      </div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>3</div>
          <h5 className={styles.title}>Pick Your Ride</h5>
          <p className={styles.desc}>
            You will receive a confirmation message. Reach the pick up point on
            time and pay the security deposit.
          </p>
        </section>
      </div>

      <div className={styles.row}>
        <section>
          <div className={styles.number}>4</div>
          <h5 className={styles.title}>End Your Ride</h5>
          <p className={styles.desc}>
            After having enjoyed every moment of your ride you can drop the
            vehicle at the same location as the pick up point. Security deposit
            will be refunded after checking for damages and challan (if any).
          </p>
        </section>
      </div>
    </div>
  );
};

export default Timeline;
