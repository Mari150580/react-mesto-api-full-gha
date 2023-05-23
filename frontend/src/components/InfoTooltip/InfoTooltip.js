import React from "react";

function InfoTooltip({ isOpen, onClose, name, title, Union }) {
  return (
    <div className={`popup popup_${name} ${isOpen ? "popup_opened" : ""}`}>
      <div className={`popup__container`}>
        <button
          onClick={onClose}
          className={`popup__close popup__close_${name} `}
          type="button"
          aria-label="close"
        ></button>
        <img src={Union} alt="Rectangle" className="popup__register_icon" />
        <p className="popup__register_title">{title}</p>
      </div>
    </div>
  );
}

export default InfoTooltip;
