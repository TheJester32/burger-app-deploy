import React, { useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import modalStyles from "./modal.module.css";
import ModalOverlay from "./modalOverlay";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

function Modal({ children, isOpen, handleClose }: ModalProps) {
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={modalStyles.modal}>
      <ModalOverlay handleClose={handleClose} />
      <div className={modalStyles.modal_content}>
        <div data-cy="modal-close-btn" onClick={handleClose}>
        <CloseIcon type="primary"/>
        </div>
        {children}
      </div>
    </div>,
    document.getElementById("react-modals")!
  );
}

export default Modal;
