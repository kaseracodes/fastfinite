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

const HomePage = () => {
  const heading = `Your<br /><span style="color:${COLORS.yellow}">Urban Adventure</span><br />Starts Here !`;

  const responsive = {
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

  const [showDots, setShowDots] = useState(window.innerWidth <= 550);

  useEffect(() => {
    const handleResize = () => {
      setShowDots(window.innerWidth <= 550);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Wrapper>
      <Navbar />

      <Banner
        heading={heading}
        buttonText="Book Your Bike"
        imagePath="/images/home_banner.png"
      />

      <div className={styles.div2}>
        <img
          src="/images/home_page/image1.png"
          alt="image"
          className={styles.div2Image}
        />
        <div>
          <Timeline />
        </div>
      </div>

      <div className={styles.div4}>
        <div className={styles.carouselContainer}>
          <h5 className={styles.div4Heading}>What Our Clients Say</h5>
          <Carousel
            responsive={responsive}
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
    </Wrapper>
  );
};

export default HomePage;
