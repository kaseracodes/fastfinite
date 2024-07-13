import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoDiv}>
        <img src="/images/logo3.png" alt="logo" />
        <img src="/images/logo2.png" alt="logo" />
      </div>

      <div className={styles.linkDiv}>
        <div className={styles.innerLinkDiv}>
          <Link to="/" className={styles.link}>
            Contact Us
          </Link>
          <Link to="/" className={styles.link}>
            Privacy Policy
          </Link>
          <Link to="/" className={styles.link}>
            Terms and Conditions
          </Link>
        </div>

        <div className={styles.innerLinkDiv}>
          <Link to="/" className={styles.link}>
            Offers
          </Link>
          <Link to="/" className={styles.link}>
            List Your Vehicle
          </Link>
          <Link to="/#faq" className={styles.link}>
            FAQs
          </Link>
        </div>

        <div className={styles.innerLinkDiv}>
          <Link to="/about-us" className={styles.link}>
            About Us
          </Link>
          <Link to="mailto:support@fastfinite.com" className={styles.link}>
            support@fastfinite.com
          </Link>
          <Link to="tel:+918448444897" className={styles.link}>
            +918448444897
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
