/* eslint-disable react/prop-types */
import { COLORS } from "../../assets/constants";
import Button from "../Button/Button";
import styles from "./Banner.module.css";

const Banner = ({ imagePath, heading, description, buttonText, onClick }) => {
  return (
    <div
      style={{ backgroundImage: `url("${imagePath}")` }}
      className={styles.container}
    >
      <h1
        dangerouslySetInnerHTML={{ __html: heading }}
        className={styles.heading}
      />
      {description && (
        <p
          dangerouslySetInnerHTML={{ __html: description }}
          className={styles.desc}
        />
      )}

      {buttonText && (
        <Button
          bgColor={COLORS.yellow}
          textColor={COLORS.black}
          content={buttonText}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default Banner;
