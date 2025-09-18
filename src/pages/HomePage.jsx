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
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import useBanners from "../utils/useBanners"; // Import the custom hook

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageUrl = `https://fastfinite.in${location.pathname}`;

  // Fetch banners for homepage
  const { banners, loading: bannersLoading, error: bannersError } = useBanners("homepage_top");
  
  // Local state for dynamic content
  const [ogImage, setOgImage] = useState("https://fastfinite.in/og-image.jpg");
  const [bannerImage, setBannerImage] = useState("/images/home_banner.png");

  const heading = `EXPLORE.<br /><span style="color:${COLORS.yellow}">RIDE.</span> REPEAT.`;

  const responsive1 = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1350 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1350, min: 1200 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1200, min: 900 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 900, min: 650 },
      items: 2,
    },
    mini: {
      breakpoint: { max: 650, min: 0 },
      items: 1,
    },
  };

  const responsive2 = {
    superLargeDesktop: {
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

  const [showDots, setShowDots] = useState(window.innerWidth <= 650);

  useEffect(() => {
    const handleResize = () => {
      setShowDots(window.innerWidth <= 650);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location]);

  // Update both og:image and banner image when banners change
  useEffect(() => {
    console.log("🏠 Homepage banner data changed:", { 
      bannersLoading, 
      bannersError, 
      banners, 
      bannersLength: banners?.length 
    });
    
    if (!bannersLoading && !bannersError && banners && banners.length > 0) {
      const newImageUrl = banners[0].bannerUrl;
      console.log("✅ Setting new homepage images:", newImageUrl);
      
      // Update both og:image and banner image
      setOgImage(newImageUrl);
      setBannerImage(newImageUrl);
    } else {
      console.log("🏠 Using default homepage images");
      // Keep default images
      setOgImage("https://fastfinite.in/og-image.jpg");
      setBannerImage("/images/home_banner.png");
    }
  }, [banners, bannersLoading, bannersError]);

  return (
    <Wrapper>
      <Helmet>
        <title>Fast Finite – Premium Bike Rentals in Kolkata</title>
        <meta
          name="description"
          content="Fast Finite offers premium bike rentals and guided tours in Kolkata, India. Explore our city and mountain bikes for every adventure."
        />
        <meta
          name="keywords"
          content="bike rental Kolkata, cycle tours West Bengal, mountain bike rent, premium bike rental India"
        />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph with dynamic image */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fast Finite – Premium Bike Rentals in Kolkata" />
        <meta property="og:description" content="Explore Kolkata on two wheels with Fast Finite's premium bike rentals and guided tours." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />

        {/* JSON-LD: Rental Service */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "RentalService",
            "name": "Fast Finite",
            "image": "https://fastfinite.in/logo.png",
            "description": "Fast Finite provides premium bike rentals and guided tours in Kolkata, West Bengal, India.",
            "telephone": "+91-9007074744",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "8 Beck Bagan Row ",
              "addressLocality": "Kolkata",
              "addressRegion": "West Bengal",
              "postalCode": "700017",
              "addressCountry": "IN"
            },
            "openingHours": "Mo-Su 08:00-19:00",
            "priceRange": "₹₹",
            "url": "https://fastfinite.in"
          }
          `}
        </script>

        {/* JSON-LD: FAQPage */}
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What documents are required for bike rental?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aadhar Card, Driving License and Student/Employee ID Card are required at pickup."
                }
              },
              {
                "@type": "Question",
                "name": "Is fuel included in the rent?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, fuel charges are not included in rent or deposit."
                }
              }
            ]
          }
          `}
        </script>
      </Helmet>

      <Navbar />

      {/* Dynamic Banner component with Firebase image */}
      <Banner
        heading={heading}
        buttonText="Book Your Bike"
        imagePath={bannerImage}
        onClick={() => navigate("/vehicles")}
      />

      <div className={styles.div1}>
        <h5 className={styles.div1Heading}>Browse by Style</h5>

        <div className={styles.categoryCarousel}>
          <Carousel
            responsive={responsive1}
            showDots={showDots}
            arrows={!showDots}
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
