/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./Navbar.module.css";
// import { COLORS } from "../../assets/constants";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import SignIn from "../SignIn/SignIn";

const Navbar = ({ bgColor }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const showNavbar = () => {
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

  const handleClick = () => {
    if (user) {
      navigate("/user");
    } else {
      setOpenModal(true);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div onClick={() => navigate("/")} className={styles.logoDiv}>
          <img src="/images/logo.png" alt="logo" className={styles.logo} />
          <img src="/images/logo2.png" alt="logo" className={styles.logo2} />
        </div>

        <div
          className={`${styles.rightContainer} ${
            navbarOpen ? styles.responsive_nav : ""
          }`}
        >
          <Link to="/" className={styles.link}>
            Home
          </Link>

          <Link to="/about-us" className={styles.link}>
            About Us
          </Link>

          <Link to="/bikes" className={styles.link}>
            Book Your Bike
          </Link>

          <Link to="/#testimonials" className={styles.link}>
            Testimonials
          </Link>

          <Link to="/list" className={styles.link}>
            List Vehicle
          </Link>

          <img
            src="/images/avatar.png"
            alt="image"
            className={styles.avator}
            onClick={handleClick}
          />

          <button
            className={`${styles.faIcon} ${styles.closeBtn}`}
            onClick={showNavbar}
          >
            <FaTimes />
          </button>
        </div>

        <button className={styles.faIcon} onClick={showNavbar}>
          <FaBars />
        </button>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <SignIn />
      </Modal>
    </>
  );
};

export default Navbar;
