/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import Wrapper from "../components/Wrapper/Wrapper";
import { CgProfile } from "react-icons/cg";
import { MdOutlineBookmarks } from "react-icons/md";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const [tab, setTab] = useState("profile");
  const [bookingTab, setBookingTab] = useState("confirmed");
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    mobile: false,
    address: false,
  });

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    mobile: "8569475962",
    address: "",
    profilePic: "/images/avatar.jpg",
    bookings: {
      confirmed: [],
      pending: [],
      cancelled: [],
    },
  });

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = (field) => {
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profilePic").click();
  };

  const BookingsCard = ({ bookings }) => {
    return (
      <>
        {bookings.length > 0 ? (
          <></>
        ) : (
          <p className={styles.para}>No bookings found!</p>
        )}
      </>
    );
  };

  return (
    <Wrapper>
      <Navbar />

      <div className={styles.div1}>
        <div className={styles.leftDiv}>
          <div className={styles.imageDiv}>
            <img src={profile.profilePic} alt="profile-image" />
            <h5 className={styles.heading}>{profile.name}</h5>
            <button onClick={triggerFileInput} className={styles.editBtn}>
              Change profile pic
            </button>
            <input
              id="profilePic"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.tabContainer}>
            <button
              className={`${styles.tabBtn} ${
                tab === "profile" ? styles.activeTabBtn : ""
              }`}
              onClick={() => setTab("profile")}
            >
              <CgProfile /> Profile
            </button>
            <button
              className={`${styles.tabBtn} ${
                tab === "bookings" ? styles.activeTabBtn : ""
              }`}
              onClick={() => setTab("bookings")}
            >
              <MdOutlineBookmarks /> Bookings
            </button>
          </div>
        </div>

        {tab === "profile" ? (
          <div className={styles.rightDiv}>
            <div className={styles.innerRightDiv}>
              <h5 className={styles.heading}>Profile</h5>
              <p className={styles.subHeading}>User Details</p>
            </div>
            <div className={styles.profileDetails}>
              {Object.keys(profile).map(
                (field) =>
                  field !== "profilePic" &&
                  field !== "bookings" && (
                    <div key={field} className={styles.innerRightDiv}>
                      <label className={styles.subHeading}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      {isEditing[field] ? (
                        <div>
                          <input
                            type="text"
                            name={field}
                            value={profile[field]}
                            onChange={handleChange}
                            className={styles.input}
                          />

                          <button
                            onClick={() => handleSaveClick(field)}
                            className={styles.editBtn2}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className={styles.para}>{profile[field]}</span>
                          {field !== "mobile" && (
                            <button
                              onClick={() => handleEditClick(field)}
                              className={styles.editBtn2}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        ) : (
          <div className={styles.rightDiv}>
            <div className={styles.innerRightDiv}>
              <h5 className={styles.heading}>Bookings</h5>
              <p className={styles.subHeading}>Manage your bookings</p>
            </div>
            <div className={styles.bookingTabContainer}>
              <button
                className={`${styles.bookingTab} ${
                  bookingTab === "confirmed" ? styles.activeBookingTab : ""
                }`}
                onClick={() => setBookingTab("confirmed")}
              >
                Confirmed
              </button>
              <button
                className={`${styles.bookingTab} ${
                  bookingTab === "pending" ? styles.activeBookingTab : ""
                }`}
                onClick={() => setBookingTab("pending")}
              >
                Pending
              </button>
              <button
                className={`${styles.bookingTab} ${
                  bookingTab === "cancelled" ? styles.activeBookingTab : ""
                }`}
                onClick={() => setBookingTab("cancelled")}
              >
                Cancelled
              </button>
            </div>
            <div className={styles.bookingsContainer}>
              {bookingTab === "confirmed" && (
                <BookingsCard bookings={profile.bookings.confirmed} />
              )}
              {bookingTab === "pending" && (
                <BookingsCard bookings={profile.bookings.pending} />
              )}
              {bookingTab === "cancelled" && (
                <BookingsCard bookings={profile.bookings.cancelled} />
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </Wrapper>
  );
};

export default ProfilePage;
