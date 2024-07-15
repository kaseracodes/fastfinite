import { useState } from "react";
import styles from "./SignIn.module.css";
// import { COLORS } from "../../assets/constants";

const SignIn = () => {
  const [form, setForm] = useState("login");
  const [otpFieldVisible, setOtpFieldVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");

  const validatePhoneNo = (phone) => {
    const indianPhonePattern = /^[6-9]\d{9}$/;
    return indianPhonePattern.test(phone);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleLoginGetOtp = (e) => {
    e.preventDefault();

    if (!validatePhoneNo(phoneNo)) {
      alert("Enter a valid phone number");
      setPhoneNo("");
      return;
    }

    setOtpFieldVisible(!otpFieldVisible);
  };

  const handleSignupGetOtp = (e) => {
    e.preventDefault();

    if (
      !validatePhoneNo(phoneNo) ||
      !validateEmail(email) ||
      name.trim().length === 0
    ) {
      alert("Enter a valid details");
      setPhoneNo("");
      setEmail("");
      setName("");
      return;
    }

    setOtpFieldVisible(!otpFieldVisible);
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();

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
                placeholder="Enter Phone no..."
                className={styles.input}
                required={true}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                Get OTP
              </button>
            </form>
          ) : (
            <form className={styles.inputContainer} onSubmit={handleSubmitOtp}>
              <p className={styles.para}>
                An OTP has been sent to your phone number.
              </p>
              <input
                type="text"
                placeholder="Enter OTP..."
                className={styles.input}
                required={true}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                Log In
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
                placeholder="Enter Your Name..."
                className={styles.input}
                required={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter Email..."
                className={styles.input}
                required={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Enter Phone no..."
                className={styles.input}
                required={true}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                Get OTP
              </button>
            </form>
          ) : (
            <form className={styles.inputContainer} onSubmit={handleSubmitOtp}>
              <p className={styles.para}>
                An OTP has been sent to your phone number.
              </p>
              <input
                type="text"
                placeholder="Enter OTP..."
                className={styles.input}
                required={true}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className={styles.btn2} type="submit">
                Log In
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SignIn;
