import { useState } from "react";
import styles from "./SignIn.module.css";
import { validateEmail, validatePhoneNo } from "../../utils/validations";
import signUpWithPhone from "../../utils/signUpWithPhone";
import verifyOTP from "../../utils/verifyOTP";
import login from "../../utils/login";
import { BeatLoader } from "react-spinners";
import { COLORS } from "../../assets/constants";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
import { notification } from "antd";

const SignIn = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState("login");
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoginGetOtp = async (e) => {
    e.preventDefault();

    if (!validatePhoneNo(phoneNo)) {
      notification["error"]({
        message: `Enter valid phone no`,
        duration: 3,
      });
      setPhoneNo("");
      return;
    }

    setLoading(true);

    try {
      const formattedPhoneNo = "+91" + phoneNo;
      const { message, confirmation, statusCode } = await login(
        formattedPhoneNo
      );

      if (statusCode !== 200) {
        notification["error"]({
          message: `${message}`,
          duration: 3,
        });
        setLoading(false);
        return;
      }

      setConfirmationResult(confirmation);
    } catch (error) {
      console.log(error.message);
      notification["error"]({
        message: `Error! Try again later...`,
        duration: 3,
      });
      setLoading(false);
      return;
    }

    setOtpFieldVisible(!otpFieldVisible);
    setLoading(false);
  };

  const handleSignupGetOtp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      notification["error"]({
        message: `Enter valid email`,
        duration: 3,
      });
      setEmail("");
      return;
    }

    if (!validatePhoneNo(phoneNo)) {
      notification["error"]({
        message: `Enter valid phone no`,
        duration: 3,
      });
      setPhoneNo("");
      return;
    }

    setLoading(true);

    try {
      const formattedPhoneNo = "+91" + phoneNo;
      const { message, confirmation, statusCode } = await signUpWithPhone(
        email,
        formattedPhoneNo
      );

      if (statusCode !== 200) {
        notification["error"]({
          message: `${message}`,
          duration: 3,
        });
        setLoading(false);
        return;
      }

      setConfirmationResult(confirmation);
    } catch (error) {
      console.log(error.message);
      notification["error"]({
        message: `Error! Try again later...`,
        duration: 3,
      });
      setLoading(false);
      return;
    }

    setOtpFieldVisible(!otpFieldVisible);
    setLoading(false);
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formattedPhoneNo = "+91" + phoneNo;
      const { message, statusCode, user } = await verifyOTP(
        confirmationResult,
        otp,
        email,
        name,
        formattedPhoneNo
      );
      if (statusCode !== 200) {
        notification["error"]({
          message: `${message}`,
          duration: 3,
        });
        setLoading(false);
        return;
      }
      console.log(user);
      setOtp("");
      setName("");
      setEmail("");
      setPhoneNo("");

      dispatch(loginUser({ ...user }));
      notification["success"]({
        message: `${message}`,
        duration: 3,
      });
    } catch (error) {
      console.log(error.message);
      notification["error"]({
        message: `Error! Try again later...`,
        duration: 3,
      });
      setLoading(false);
      return;
    }

    setOtpFieldVisible(!otpFieldVisible);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topDiv}>
        <button
          className={`${styles.btn1} ${
            form === "login" ? styles.activeBtn : ""
          }`}
          onClick={() => {
            if (!loading) {
              setForm("login");
              setOtpFieldVisible(false);
            }
          }}
        >
          Log In
        </button>
        <button
          className={`${styles.btn1} ${
            form === "signup" ? styles.activeBtn : ""
          }`}
          onClick={() => {
            if (!loading) {
              setForm("signup");
              setOtpFieldVisible(false);
            }
          }}
        >
          Sign Up
        </button>
      </div>

      {form === "login" ? (
        <div>
          {!otpFieldVisible ? (
            <form
              className={styles.inputContainer}
              onSubmit={handleLoginGetOtp}
            >
              <input
                type="tel"
                placeholder="Enter 10-digit Phone no"
                className={styles.input}
                required={true}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                {loading ? (
                  <BeatLoader color={COLORS.black} size={18} />
                ) : (
                  "Get OTP"
                )}
              </button>

              <div id="recaptcha"></div>
            </form>
          ) : (
            <form className={styles.inputContainer} onSubmit={handleSubmitOtp}>
              <p className={styles.para}>
                An OTP has been sent to your phone number.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                className={styles.input}
                required={true}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                {loading ? (
                  <BeatLoader color={COLORS.black} size={18} />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div>
          {!otpFieldVisible ? (
            <form
              className={styles.inputContainer}
              onSubmit={handleSignupGetOtp}
            >
              <input
                type="text"
                placeholder="Enter Your Name"
                className={styles.input}
                required={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter Email"
                className={styles.input}
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Enter 10-digit Phone no."
                className={styles.input}
                required={true}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                {loading ? (
                  <BeatLoader color={COLORS.black} size={18} />
                ) : (
                  "Get OTP"
                )}
              </button>

              <div id="recaptcha"></div>
            </form>
          ) : (
            <form className={styles.inputContainer} onSubmit={handleSubmitOtp}>
              <p className={styles.para}>
                An OTP has been sent to your phone number.
              </p>
              <input
                type="text"
                placeholder="Enter OTP"
                className={styles.input}
                required={true}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                {loading ? (
                  <BeatLoader color={COLORS.black} size={18} />
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SignIn;
