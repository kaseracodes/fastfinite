import { Link, useLocation } from "react-router-dom";
import { COLORS } from "../assets/constants";
import ContactUs from "../components/ContactUs/ContactUs";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import QualityPolicy from "../components/QualityPolicy/QualityPolicy";
import Wrapper from "../components/Wrapper/Wrapper";
import styles from "./AboutUsPage.module.css";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useBanners from "../utils/useBanners";

const AboutUsPage = () => {
  const location = useLocation();
  
  // Fetch banners for about us page
  const { banners, loading: bannersLoading, error: bannersError } = useBanners("about_us_page");
  
  // Local state to track both og:image and banner background
  const [ogImage, setOgImage] = useState("https://fastfinite.in/images/about_us/image1.jpg");
  const [bannerBackground, setBannerBackground] = useState("");

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

  // Update both og:image and banner background when banners change
  useEffect(() => {
    console.log("🖼️ Banner data changed:", { 
      bannersLoading, 
      bannersError, 
      banners, 
      bannersLength: banners?.length 
    });
    
    if (!bannersLoading && !bannersError && banners && banners.length > 0) {
      const newImageUrl = banners[0].bannerUrl;
      console.log("✅ Setting new banner background:", newImageUrl);
      
      // Update both og:image and banner background
      setOgImage(newImageUrl);
      setBannerBackground(newImageUrl);
    } else {
      console.log("📷 Using default images");
      // Keep default images
      setOgImage("https://fastfinite.in/images/about_us/image1.jpg");
      setBannerBackground(""); // Empty string will use CSS default background
    }
  }, [banners, bannersLoading, bannersError]);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Speed Auto Service Pvt. Ltd.",
    "url": "https://fastfinite.in/about-us",
    "logo": "https://fastfinite.in/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9007074744",
      "contactType": "customer service",
      "email": "support@fastfinite.in"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "8, Beck Bagan Row",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700017",
      "addressCountry": "IN"
    }
  };

  return (
    <Wrapper>
      <Helmet>
        <title>About Us | Fast Finite Bike Rentals</title>
        <meta
          name="description"
          content="Learn about Speed Group's bike rental services in Kolkata. Affordable, sustainable, and convenient urban mobility solutions."
        />
        <link rel="canonical" href="https://fastfinite.in/about-us" />
        <meta property="og:title" content="About Us | Fast Finite Bike Rentals" />
        <meta
          property="og:description"
          content="Discover our bike rental service for affordable and sustainable city mobility."
        />
        <meta property="og:url" content="https://fastfinite.in/about-us" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Navbar />

      {/* Dynamic banner background that changes based on Firebase banner */}
      <div 
        className={styles.bannerContainer}
        style={{
          backgroundImage: bannerBackground ? `url(${bannerBackground})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1 className={styles.bannerHeading}>
          Your <span style={{ color: COLORS.yellow }}>Urban Adventure</span> Starts Here !
        </h1>
        <p className={styles.bannerDesc}>
          Join us in this exciting new journey. Discover the ease,
          affordability, and benefits of bike rentals with Speed Group, and
          experience the city like never before.
        </p>
      </div>

      <div className={styles.div2}>
        <div className={styles.descDiv}>
          <h5 className={styles.heading}>A Legacy of Mobility</h5>
          <hr className={styles.hr} />
          <p className={styles.desc}>
            Speed Group, a name synonymous with quality and reliability in the
            automotive sector, is excited to introduce its latest venture: bike
            rentals. With a deep-rooted understanding of transportation needs,
            we&apos;re committed to providing innovative solutions that cater to
            the evolving demands of city dwellers.
            <br />
            <br />
            The benefits of bike rentals are numerous and cater to a wide range
            of lifestyles and requirements. For the young, office-going
            generation, bikes offer a convenient and efficient way to navigate
            through city traffic, ensuring you arrive at work on time without
            the hassle of parking or public waste delays. You also save on
            the costs of maintenance, fuel, insurance, and parking, making it an
            economical choice for students, young professionals, and anyone
            looking to reduce their transportation expenses.
            <br />
            <br />
            For temporary residents of a city, such as students or business
            travellers, bike rentals provide the perfect solution for short-term
            mobility needs. Whether you&apos;re in town for a semester or a few
            months on a work assignment, you can enjoy the freedom of moving
            around the city without the long-term commitment of purchasing a
            bike.
            <br />
            <br />
            At Speed Group, we understand the importance of sustainability. Our
            bike rental service not only offers convenience and savings but also
            contributes to reducing carbon emissions and easing urban
            congestion. By choosing to rent a bike, you&apos;re making a
            positive impact on the environment and supporting a greener future.
          </p>
        </div>
        <img src="/images/about_us/image1.jpg" alt="bike" />
      </div>

      <QualityPolicy />
      <ContactUs />

      <div className={styles.div3}>
        <div className={styles.div3Content}>
          <h5 className={styles.div3Heading}>
            You may contact us using the information below:
          </h5>
          <p className={styles.para}>
            Company name: SPEED AUTO SERVICE PRIVATE LIMITED
          </p>
          <p className={styles.para}>
            Registered Address: 8, Beck Bagan Row, Kolkata, West Bengal, PIN:
            700017
          </p>
          <p className={styles.para}>
            Operational Address: 8, Beck Bagan Row, Kolkata, West Bengal, PIN:
            700017
          </p>
          <p className={styles.para}>
            Telephone No:{" "}
            <Link to="tel:+919007074744" className={styles.link}>
              +919007074744
            </Link>
          </p>
          <p className={styles.para}>
            E-Mail ID:{" "}
            <Link to="mailto:support@fastfinite.in" className={styles.link}>
              support@fastfinite.in
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
};

export default AboutUsPage;
