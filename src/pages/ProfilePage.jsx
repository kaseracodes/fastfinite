/* eslint-disable react/prop-types */
import { useState } from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import Wrapper from "../components/Wrapper/Wrapper";
import { CgProfile } from "react-icons/cg";
import { MdOutlineBookmarks } from "react-icons/md";
import styles from "./ProfilePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, storage } from "../firebase/config";
import { loginUser, logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
// import { MoonLoader } from "react-spinners";
import updateProfile from "../utils/updateProfile";
import AuthHoc from "../hoc/AuthHoc";
import { getFunctions, httpsCallable } from "firebase/functions";
// import { COLORS } from "../assets/constants";
import PageLoader from "../components/PageLoader/PageLoader";
import { formatDate } from "../utils/formatDate";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);

  const [tab, setTab] = useState("profile");
  // const [bookingTab, setBookingTab] = useState("confirmed");
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phoneNo: false,
    address: false,
  });

  const [profile, setProfile] = useState({
    uid: user && user.uid,
    name: user && user.name,
    email: user && user.email,
    phoneNo: user && user.phoneNo,
    address: user && user.address,
    profilePic:
      user && user.profilePic ? user.profilePic : "/images/avatar.jpg",
    // bookings: user && user.bookings,
    bookings: [],
  });
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const getBookings = httpsCallable(getFunctions(), "getBookings");
      const res = await getBookings({ uid: profile.uid });
      const { statusCode, bookings, message } = res.data;

      if (statusCode === 200) {
        setProfile((prev) => ({ ...prev, bookings: bookings }));
      } else {
        notification["error"]({
          message: message,
          duration: 3,
        });
      }
    } catch (error) {
      console.log(error);
      notification["error"]({
        message: `Error fetching bookings`,
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    setTab(tab);

    if (tab === "bookings") {
      await fetchBookings();
    }
  };

  const handleEditClick = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSaveClick = async (field) => {
    setIsEditing({ ...isEditing, [field]: false });

    try {
      const { statusCode, message } = await updateProfile(
        field,
        profile[field],
        profile.uid
      );
      if (statusCode === 200) {
        dispatch(loginUser(profile));

        notification["success"]({
          message: `${message}`,
          duration: 3,
        });
      } else {
        notification["error"]({
          message: `${message}`,
          duration: 3,
        });
      }
    } catch (error) {
      notification["error"]({
        message: `Error updating profile`,
        duration: 3,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const storageRef = ref(storage, `profilePictures/${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePic: downloadURL,
        }));

        notification["success"]({
          message: "Profile pic updated successfully",
          duration: 3,
        });
      } catch (error) {
        notification["success"]({
          message: "Error uploading file",
          duration: 3,
        });
      }
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);
      dispatch(logoutUser());
      notification["success"]({
        message: `Logged out successfully`,
        duration: 3,
      });
      navigate("/");
    } catch (error) {
      notification["error"]({
        message: `Error logging out`,
        duration: 3,
      });
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profilePic").click();
  };

  const BookingsContainer = ({ bookings }) => {
    return (
      <>
        {bookings.length > 0 ? (
          <div className={styles.cardContainer}>
            {bookings.map((item, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.contentDiv}>
                  <p className={styles.dateTime}>
                    Booking date and time: {formatDate(item.createdAt)}
                  </p>
                  <p className={styles.vehicleName}>{item.vehicleName}</p>
                  <p className={styles.bookingPara}>
                    Pick up date: {formatDate(item.startTime)}
                  </p>
                  <p className={styles.bookingPara}>
                    Drop off date: {formatDate(item.endTime)}
                  </p>
                  <p className={styles.bookingPara}>
                    Total amount paid: {item.amount}
                  </p>
                  <p className={styles.bookingPara}>
                    Refundable deposit: {item.deposit}
                  </p>
                </div>
                <div className={styles.vehicleImageDiv}>
                  <img
                    src={item.vehicleImage}
                    alt="vehicle image"
                    className={styles.vehicleImage}
                  />
                </div>
              </div>
            ))}
          </div>
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
              onClick={() => handleTabChange("profile")}
            >
              <CgProfile /> Profile
            </button>
            <button
              className={`${styles.tabBtn} ${
                tab === "bookings" ? styles.activeTabBtn : ""
              }`}
              onClick={() => handleTabChange("bookings")}
            >
              <MdOutlineBookmarks /> Bookings
            </button>
          </div>
        </div>

        <div className={styles.outerRightDiv}>
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
                    field !== "bookings" &&
                    field != "uid" && (
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
                            <span className={styles.para}>
                              {profile[field]}
                            </span>
                            {field !== "phoneNo" && (
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
                <p className={styles.subHeading}>Your Recent Bookings</p>
              </div>
              {/* <div className={styles.bookingTabContainer}>
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
              </div> */}
              <div className={styles.bookingsContainer}>
                {/* {bookingTab === "confirmed" && (
                  <BookingsCard bookings={profile.bookings.confirmed} />
                )}
                {bookingTab === "pending" && (
                  <BookingsCard bookings={profile.bookings.pending} />
                )}
                {bookingTab === "cancelled" && (
                  <BookingsCard bookings={profile.bookings.cancelled} />
                )} */}
                {loading ? (
                  <PageLoader />
                ) : (
                  <BookingsContainer bookings={profile.bookings} />
                )}
              </div>
            </div>
          )}
          <button className={styles.logout} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <Footer />
    </Wrapper>
  );
};

export default AuthHoc(ProfilePage);
