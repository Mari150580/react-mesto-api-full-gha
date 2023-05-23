import React from "react";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import UnionError from "../../images/UnionError.svg";

function InfoTooltipError({ isOpen, onClose }) {
  return (
    <InfoTooltip
      onClose={onClose}
      name="error"
      isOpen={isOpen}
      title="Что-то пошло не так! Попробуйте ещё раз."
      Union={UnionError}
    />
  );
}

export default InfoTooltipError;
