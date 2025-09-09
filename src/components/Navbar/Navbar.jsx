/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
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
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) setOpenModal(false);
  }, [user]);

  const handleClick = () => {
    if (user) navigate("/profile");
    else setOpenModal(true);
  };

  return (
    <>
      <div className={styles.container} style={{ backgroundColor: bgColor || undefined }}>
        {/* Logo lockup */}
        <div className={styles.logoWrap} onClick={() => navigate("/")}>
          {/* Emblem / bike icon */}
          <img src="/images/logo.png" alt="Fast Finite emblem" className={styles.emblem} />

          {/* Wordmark + separator + tagline */}
          <div className={styles.wordmarkWrap}>
            {/* Use the image wordmark if available */}
            <img src="/images/logo2.png" alt="Fast Finite" className={styles.wordmark} />
            {/* vertical dash/separator */}
            <div className={styles.sep} aria-hidden="true" />
            {/* tagline in Inter font */}
            <div className={styles.tagline}>Bike Rentals</div>
          </div>
        </div>

        {/* Right-side nav */}
        <div className={`${styles.rightContainer} ${navbarOpen ? styles.responsive_nav : ""}`}>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/about-us" className={styles.link}>About Us</Link>
          <Link to="/vehicles" className={styles.link}>Book Your Bike</Link>
          <Link to="/vehicles/?transmissionType=premiumBike" className={styles.link}>Premium Bike</Link>
          <a href="https://forms.gle/qHLa8LJe6HcqxPT39" target="_blank" rel="noreferrer" className={styles.link}>Become A Dealer</a>

          <img src="/images/avatar.png" alt="profile" className={styles.avator} onClick={handleClick} />

          <button className={`${styles.faIcon} ${styles.closeBtn}`} onClick={showNavbar}><FaTimes /></button>
        </div>

        <button className={styles.faIcon} onClick={showNavbar}><FaBars /></button>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <SignIn />
      </Modal>
    </>
  );
};

export default Navbar;