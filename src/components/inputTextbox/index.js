import React from "react";
import PropTypes from "prop-types";
import "./inputBox.css";

/**
 * Primary UI component for user interaction
 */
export const InputBox = ({ size, placeHolder, ...props }) => {
  //const borderCustom = border ? "border-without-bgColor" : "borderLess";
  return (
    <input
      type="text"
      placeholder={placeHolder}
      className={["input-text", `input-text--${size}`].join(" ")}
      /* style={
      } */
      {...props}
    ></input>
  );
};

InputBox.propTypes = {
  /*
   * How large should the button be?
   */
  size: PropTypes.oneOf(["small", "medium", "large", "xlarge"]),
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
  placeHolder: PropTypes.string.isRequired,
  /**
   * Optional Tooltip handler
   */
};

InputBox.defaultProps = {
  size: "medium",
  placeHolder: "Input text Box",
  onClick: undefined,
};
