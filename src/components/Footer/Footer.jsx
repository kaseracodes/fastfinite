import { Link, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.logoDiv} onClick={() => navigate("/")}>
        <img src="/images/logo.png" alt="logo" />
        <img src="/images/logo2.png" alt="logo" />
      </div>

      <div className={styles.linkDiv}>
        <div className={styles.innerLinkDiv}>
          <Link to="/about-us#contactUs" className={styles.link}>
            Contact Us
          </Link>
          {/* <Link to="/" className={styles.link}>
            Privacy Policy
          </Link> */}
          <Link to="/tnc" className={styles.link}>
            Terms and Conditions
          </Link>
        </div>

        <div className={styles.innerLinkDiv}>
          {/* <Link to="/" className={styles.link}>
            Offers
          </Link> */}
          <Link to="/#faq" className={styles.link}>
            FAQs
          </Link>
          <Link to="/" className={styles.link}>
            List Your Vehicle
          </Link>
        </div>

        <div className={styles.innerLinkDiv}>
          {/* <Link to="/about-us" className={styles.link}>
            About Us
          </Link> */}
          <Link to="tel:+918240530305" className={styles.link}>
            +918240530305
          </Link>
          <Link to="mailto:support@fastfinite.in" className={styles.link}>
            support@fastfinite.in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
