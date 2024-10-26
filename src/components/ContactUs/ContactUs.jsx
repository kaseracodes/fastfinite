// import { COLORS } from "../../assets/constants";
import { useState } from "react";
import styles from "./ContactUs.module.css";
import { BeatLoader } from "react-spinners";
import { COLORS } from "../../assets/constants";
import { getFunctions, httpsCallable } from "firebase/functions";
import { notification } from "antd";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const sendMailByUser = httpsCallable(getFunctions(), "sendMailByUser");
      const res = await sendMailByUser({
        name,
        email,
        subject,
        userMessage,
      });

      const { statusCode, message } = res.data;
      if (statusCode === 200) {
        notification["success"]({
          message: message,
          duration: 3,
        });

        setName("");
        setEmail("");
        setSubject("");
        setUserMessage("");
      } else {
        notification["error"]({
          message: message,
          duration: 3,
        });
      }
    } catch (error) {
      console.log(error);
      notification["error"]({
        message: "Error sending message.",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} id="contactUs">
      <img src="/images/contact_us.jpg" alt="image" />

      <form className={styles.div} onSubmit={handleSubmit}>
        <h3 className={styles.heading}>Reach Out To Us!</h3>
        <hr className={styles.hr} />
        <div className={styles.inputDiv}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className={styles.name}
          />
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className={styles.email}
          />
        </div>

        <div className={styles.inputDiv2}>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            required
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            rows="5"
            cols="30"
            placeholder="Your Message"
            value={userMessage}
            required
            onChange={(e) => setUserMessage(e.target.value)}
          />

          <button className={styles.btn} type="submit">
            {loading ? <BeatLoader color={COLORS.black} size={18} /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
