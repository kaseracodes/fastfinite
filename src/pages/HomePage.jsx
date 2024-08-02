import { COLORS } from "../assets/constants";
import Banner from "../components/Banner/Banner";
import Navbar from "../components/Navbar/Navbar";
import Timeline from "../components/Timeline/Timeline";
import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./HomePage.module.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ReviewsData } from "../assets/ReviewsData";
import { useEffect, useState } from "react";
import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";
import { BikeCategory } from "../assets/BikeCategory";
import AccordionSection from "../components/Accordion/Accordion";
import Footer from "../components/Footer/Footer";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const heading = `Your<br /><span style="color:${COLORS.yellow}">Urban Adventure</span><br />Starts Here !`;
  const heading = `Explore.<br /><span style="color:${COLORS.yellow}">Ride.</span> Repeat.`;

  const responsive1 = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1350 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1350, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 730 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 730, min: 0 },
      items: 1,
    },
  };

  const responsive2 = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1350 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1350, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 600 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
    },
  };

  const [showDots, setShowDots] = useState(window.innerWidth <= 730);

  useEffect(() => {
    const handleResize = () => {
      setShowDots(window.innerWidth <= 730);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

      <Banner
        heading={heading}
        buttonText="Book Your Bike"
        imagePath="/images/home_banner.png"
        onClick={() => navigate("/bikes")}
      />

      <div className={styles.div1}>
        <h5 className={styles.div1Heading}>Browse by Style</h5>

        <div className={styles.categoryCarousel}>
          <Carousel
            responsive={responsive1}
            showDots={showDots}
            arrows={!showDots}
            // infinite={true}
          >
            {BikeCategory.map((item, index) => (
              <div key={index} className={styles.categoryOuterDiv}>
                <div
                  className={styles.categoryDiv}
                  onClick={() =>
                    navigate(
                      `/vehicles/?transmissionType=${item.transmissionType}`
                    )
                  }
                >
                  <img src={item.imagePath} alt="image" />
                  <p className={styles.categoryName}>{item.name}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className={styles.div2}>
        <img
          src="/images/home_page/image1.png"
          alt="image"
          className={styles.div2Image}
        />
        <div className={styles.timeline}>
          <h5 className={styles.heading}>How to book your ride?</h5>
          <p className={styles.subHeading}>
            Book your dream ride in just four simple steps
          </p>
          <Timeline />
        </div>
      </div>

      <div className={styles.div4} id="testimonials">
        <div className={styles.carouselContainer}>
          <h5 className={styles.div4Heading}>What Our Clients Say</h5>
          <Carousel
            responsive={responsive2}
            showDots={showDots}
            arrows={!showDots}
            infinite={true}
          >
            {ReviewsData.map((item, index) => (
              <div key={index} className={styles.reviewCard}>
                <img
                  src={item.profilePic}
                  alt="image"
                  className={styles.profilePic}
                />
                <div className={styles.reviewContent}>
                  <p className={styles.reviewDesc}>
                    <RiDoubleQuotesL color={COLORS.orange} /> {item.review}{" "}
                    <RiDoubleQuotesR color={COLORS.orange} />
                  </p>
                  <p className={styles.userName}>{item.user}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      <div className={styles.div5} id="faq">
        <h5 className={styles.heading}>Have Questions? We got you.</h5>
        <p className={styles.subHeading}>
          Contact us on +919007074744 WhatsApp/Call in case of any other query.
        </p>

        <AccordionSection />
      </div>

      <Footer />
    </Wrapper>
  );
};

export default HomePage;
