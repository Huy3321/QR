import React from "react";
import "./ConfirmDialog.css";

function ConfirmDialog({ children, onCancel, onConfirm, onClose }) {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="confirm-dialog-content">{children}</div>
        <div className="confirm-dialog-actions">
          <button className="cancel-button" onClick={onCancel}>
            Huỷ Bỏ
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
