/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./Button.module.css";

const Button = ({ content, bgColor, textColor, onClick, disabled }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const getButtonStyle = () => {
    if (hovered || disabled) {
      const darkColor = darkenColor(bgColor, 20);

      return {
        backgroundColor: darkColor,
        cursor: "pointer",
      };
    }

    return {
      backgroundColor: bgColor,
    };
  };

  const darkenColor = (color, percent) => {
    // Function to darken a color by a percentage
    let num = parseInt(color.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let B = ((num >> 8) & 0x00ff) + amt;
    let G = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
        (G < 255 ? (G < 1 ? 0 : G) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  return (
    <button
      className={styles.btn}
      style={getButtonStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default Button;
