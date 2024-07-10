/* eslint-disable react/prop-types */
import styles from "./Wrapper.module.css";

const Wrapper = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Wrapper;
