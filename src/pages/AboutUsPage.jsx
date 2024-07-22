import { useLocation } from "react-router-dom";
import { COLORS } from "../assets/constants";
import ContactUs from "../components/ContactUs/ContactUs";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import QualityPolicy from "../components/QualityPolicy/QualityPolicy";
import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./AboutUsPage.module.css";
import { useEffect } from "react";

const AboutUsPage = () => {
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1); // Remove the "#" from the hash
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Call the handler initially in case there's already a hash in the URL
    handleHashChange();

    // Add event listener for hash change
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location]);

  return (
    <Wrapper>
      <Navbar />

      <div className={styles.bannerContainer}>
        {/* <h1 className={styles.bannerHeading}>
          <span style={{ color: COLORS.yellow }}>Ride the Future with Us:</span>
          <br /> Your Ultimate Bike Rental Experience
        </h1> */}
        <h1 className={styles.bannerHeading}>
          Your <span style={{ color: COLORS.yellow }}>Urban Adventure</span>{" "}
          Starts Here !
        </h1>
      </div>

      <div className={styles.div2}>
        <div className={styles.descDiv}>
          <h5 className={styles.heading}>About Us</h5>
          <hr className={styles.hr} />
          <p className={styles.desc}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
        <img src="/images/about_us/image1.jpg" alt="bike" />
      </div>

      <QualityPolicy />

      <ContactUs />

      <Footer />
    </Wrapper>
  );
};

export default AboutUsPage;
