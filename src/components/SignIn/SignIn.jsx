import { useState } from "react";
import styles from "./SignIn.module.css";
import { validateEmail, validatePhoneNo } from "../../utils/validations";
import signUpWithPhone from "../../utils/signUpWithPhone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import verifyOTP from "../../utils/verifyOTP";
import login from "../../utils/login";

const SignIn = () => {
  const [form, setForm] = useState("login");
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleLoginGetOtp = async (e) => {
    e.preventDefault();

    if (!validatePhoneNo(phoneNo)) {
      toast.error("Enter valid phone no");
      setPhoneNo("");
      return;
    }

    try {
      const formattedPhoneNo = "+91" + phoneNo;
      const cnf = await login(formattedPhoneNo);
      setConfirmationResult(cnf);
    } catch (error) {
      console.log(error.message);
      toast.error("Error! Try again later...");
    }

    setOtpFieldVisible(!otpFieldVisible);
  };

  const handleSignupGetOtp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Enter valid email");
      setEmail("");
      return;
    }

    if (!validatePhoneNo(phoneNo)) {
      toast.error("Enter valid phone no");
      setPhoneNo("");
      return;
    }

    try {
      const formattedPhoneNo = "+91" + phoneNo;
      const cnf = await signUpWithPhone(formattedPhoneNo);
      setConfirmationResult(cnf);
    } catch (error) {
      console.log(error.message);
      toast.error("Error! Try again later...");
    }

    setOtpFieldVisible(!otpFieldVisible);
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    const res = await verifyOTP(confirmationResult, otp);
    console.log(res);

    setOtpFieldVisible(!otpFieldVisible);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topDiv}>
        <button
          className={`${styles.btn1} ${
            form === "login" ? styles.activeBtn : ""
          }`}
          onClick={() => setForm("login")}
        >
          Log In
        </button>
        <button
          className={`${styles.btn1} ${
            form === "signup" ? styles.activeBtn : ""
          }`}
          onClick={() => {
            setForm("signup");
            setOtp("");
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
                placeholder="Enter Phone no"
                className={styles.input}
                required={true}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                Get OTP
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
                Submit
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
                Get OTP
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
                Submit
              </button>
            </form>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default SignIn;
