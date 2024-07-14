/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./Navbar.module.css";
// import { COLORS } from "../../assets/constants";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

const Navbar = ({ bgColor }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);

  const showNavbar = () => {
    // navRef.current.classList.toggle("responsive_nav");
    setNavbarOpen(!navbarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      // className={`${styles.container} ${
      //   isScrolled || bgColor ? styles.active : ""
      // }`}
      // style={{ backgroundColor: bgColor && bgColor }}
      className={styles.container}
    >
      <div onClick={() => navigate("/")} className={styles.logoDiv}>
        <img src="/images/logo.png" alt="logo" className={styles.logo} />
        <img src="/images/logo2.png" alt="logo" className={styles.logo2} />
      </div>

      <div
        className={`${styles.rightContainer} ${
          navbarOpen ? styles.responsive_nav : ""
        }`}
      >
        {/* <Link
          to="/"
          className={styles.link}
        >
          Home
        </Link> */}
        <Link to="/about-us" className={styles.link}>
          About Us
        </Link>

        <Link to="/#testimonials" className={styles.link}>
          Testimonials
        </Link>

        <Link to="/bikes" className={styles.link}>
          Book Your Bike
        </Link>

        <Link to="/list" className={styles.link}>
          List Bike
        </Link>

        {/* <Link to="/login" className={styles.link}>
          Login
        </Link> */}

        <img src="/images/avatar.png" alt="image" className={styles.avator} />

        <button
          className={`${styles.faIcon} ${styles.closeBtn}`}
          // style={{ color: COLORS.black }}
          onClick={showNavbar}
        >
          <FaTimes />
        </button>
      </div>

      <button
        className={styles.faIcon}
        // style={{
        //   color: bgColor
        //     ? COLORS.blue
        //     : isScrolled
        //     ? COLORS.blue
        //     : COLORS.white,
        // }}
        onClick={showNavbar}
      >
        <FaBars />
      </button>
    </div>
  );
};

export default Navbar;
