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
          <Link to="/" className={styles.link}>
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
          <Link to="tel:+919007074744" className={styles.link}>
            +919007074744
          </Link>
          <Link to="mailto:reach.fastfinite@gmail.com" className={styles.link}>
            support@fastfinite.com
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
