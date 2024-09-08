import { Link, useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";
import { RiFacebookCircleLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { AiOutlineLinkedin } from "react-icons/ai";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.topDiv}>
        <div className={styles.logoDiv} onClick={() => navigate("/")}>
          <img src="/images/logo.png" alt="logo" />
          <img src="/images/logo2.png" alt="logo" />
        </div>

        <div className={styles.iconsDiv}>
          <Link
            className={styles.iconLink}
            target="__blank"
            to="https://www.facebook.com/profile.php?id=61558742827109"
          >
            <RiFacebookCircleLine size={25} className={styles.icons} />
          </Link>
          <Link
            className={styles.iconLink}
            target="__blank"
            to="https://www.instagram.com/fast_finite_bike_scooty_rental?igsh=amtxaXI5aWU1am9u"
          >
            <FaInstagram size={25} className={styles.icons} />
          </Link>
          <Link className={styles.iconLink} target="__blank" to="/">
            <AiOutlineLinkedin size={25} className={styles.icons} />
          </Link>
        </div>
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
          <Link to="tel:+919007074744" className={styles.link}>
            +919007074744
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
