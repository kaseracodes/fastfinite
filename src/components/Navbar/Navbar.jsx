/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./Navbar.module.css";
// import { COLORS } from "../../assets/constants";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import SignIn from "../SignIn/SignIn";
import { useSelector } from "react-redux";

const Navbar = ({ bgColor }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state) => state.userReducer.user);

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

  useEffect(() => {
    if (user) setOpenModal(false);
  }, [user]);

  const handleClick = () => {
    if (user) {
      navigate("/profile");
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

          <Link to="/vehicles" className={styles.link}>
            Book Your Bike
          </Link>

          {/* <Link to="/#testimonials" className={styles.link}>
            Testimonials
          </Link> */}

          <a
            href="https://forms.gle/qHLa8LJe6HcqxPT39"
            target="_blank"
            className={styles.link}
          >
            Become A Dealer
          </a>

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
