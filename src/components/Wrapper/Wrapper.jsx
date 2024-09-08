/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./Wrapper.module.css";
import { RiWhatsappFill } from "react-icons/ri";

const Wrapper = ({ children }) => {
  return (
    <>
      <div className={styles.container}>{children}</div>
      <Link
        className={styles.iconLink}
        target="__blank"
        to="https://wa.me/+919007074744"
      >
        <RiWhatsappFill size={25} className={styles.icons} />
      </Link>
    </>
  );
};

export default Wrapper;
