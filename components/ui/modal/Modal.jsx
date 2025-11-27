import { createPortal } from "react-dom";
import "./modal.css";
import { useEffect } from "react";

export const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className="ui-modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

Modal.Header = ({ children, onClose }) => (
  <div className="ui-modal-header">
    <h2 className="ui-modal-title">{children}</h2>
    {onClose && (
      <button className="ui-modal-close" onClick={onClose}>
        ✕
      </button>
    )}
  </div>
);

Modal.Body = ({ children }) => <div className="ui-modal-body">{children}</div>;

Modal.Footer = ({ children }) => (
  <div className="ui-modal-footer">{children}</div>
);
