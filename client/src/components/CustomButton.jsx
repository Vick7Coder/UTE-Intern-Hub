import React from "react";

const CustomButton = ({ title, containerStyles, iconRight, type, onClick }) => {
  return (
    <button
      type={type || "button"}
      className={`inline-flex flex-center ${containerStyles}`}
      onClick={onClick}
    >
      {title}

      {iconRight && <div>{iconRight}</div>}
    </button>
  );
};


export default CustomButton;