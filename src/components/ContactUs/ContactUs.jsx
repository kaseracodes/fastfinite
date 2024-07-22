// import { COLORS } from "../../assets/constants";
import styles from "./ContactUs.module.css";

const ContactUs = () => {
  return (
    <div className={styles.container} id="contactUs">
      <img src="/images/contact_us.jpg" alt="image" />

      <div className={styles.div}>
        <h3 className={styles.heading}>Reach Out To Us!</h3>
        <hr className={styles.hr} />
        <div className={styles.inputDiv}>
          <input type="text" placeholder="Name" className={styles.name} />
          <input
            type="email"
            placeholder="Email Address"
            className={styles.email}
          />
        </div>

        <div className={styles.inputDiv2}>
          <input type="text" placeholder="Subject" />
          <textarea rows="5" cols="30" placeholder="Your Message" />

          <button className={styles.btn}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
