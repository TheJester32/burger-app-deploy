import React from "react";
import modalStyles from "./modal.module.css";

interface ModalOverlayProps {
  handleClose: () => void;
}

function ModalOverlay({ handleClose }: ModalOverlayProps) {
  return <div className={modalStyles.overlay} onClick={handleClose} data-cy="modal-overlay"/>;
}

export default ModalOverlay;