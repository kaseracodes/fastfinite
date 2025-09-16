/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

import styles from "./Navbar.module.css";
import Modal from "../Modal/Modal";
import SignIn from "../SignIn/SignIn";
import Button from "../Button/Button";
import { COLORS } from "../../assets/constants";

const Navbar = ({ bgColor }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1000);
  const [openModal, setOpenModal] = useState(false);
  const user = useSelector((state) => state.userReducer.user);

  const showNavbar = () => setNavbarOpen((v) => !v);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 1000);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) setOpenModal(false);
  }, [user]);

  // toggle body scroll when mobile menu open
  useEffect(() => {
    if (navbarOpen) document.body.classList.add("menu-open");
    else document.body.classList.remove("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [navbarOpen]);

  const handleAvatarClick = () => {
    if (user) navigate("/profile");
    else setOpenModal(true);
  };

  const handleLoginClick = () => {
    setOpenModal(true);
    setNavbarOpen(false); // close mobile menu if open
  };

  return (
    <>
      <div className={styles.container} style={{ backgroundColor: bgColor || undefined }}>
        {/* Logo lockup */}
        <div className={styles.logoWrap} onClick={() => navigate("/")}>
          <img src="/images/logo.png" alt="Fast Finite emblem" className={styles.emblem} />
          <div className={styles.wordmarkWrap}>
            <img src="/images/logo2.png" alt="Fast Finite" className={styles.wordmark} />
            <div className={styles.sep} aria-hidden="true" />
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

          {/* avatar when logged in, otherwise Login Button */}
          {user ? (
            <img
              src={user.profilePic || "/images/avatar.png"}
              alt="profile"
              className={styles.avator}
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                bgColor={COLORS.yellow}
                textColor={COLORS.black}
                content="Login"
                onClick={handleLoginClick}
              />
            </div>
          )}

          {/* Close button (visible in CSS when drawer open) */}
          <button
            className={`${styles.faIcon} ${styles.closeBtn}`}
            onClick={showNavbar}
            aria-label={navbarOpen ? "Close menu" : "Open menu"}
          >
            <FaTimes />
          </button>
        </div>

        {/* Hamburger toggle */}
        <button
          className={styles.faIcon}
          onClick={showNavbar}
          aria-expanded={navbarOpen}
          aria-label={navbarOpen ? "Close menu" : "Open menu"}
        >
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