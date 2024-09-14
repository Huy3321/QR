import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./QrView.scss"; // Ensure this file exists and is correctly referenced
import leftArrow from "../../assets/image/Icon/left-arrow.png"; // Update path as necessary

const cx = classNames.bind(styles);

function QrView() {
  const navigate = useNavigate();
  const location = useLocation(); // To access passed state
  const [qrUrl, setQrUrl] = useState("");
  const [bankNumber, setBankNumber] = useState("");

  useEffect(() => {
    // Get qrUrl from location state
    if (location.state && location.state.qrUrl) {
      setQrUrl(location.state.qrUrl);
    }
    if (location.state && location.state.bankAccount) {
      setBankNumber(location.state.bankAccount);
    }
  }, [location.state]);

  const handleCopyAccountNumber = () => {
    // Replace '123456789' with the actual account number you want to copy
    if (bankNumber !== "") {
      var copyText = bankNumber;

      // Copy the text inside the text field
      navigator.clipboard.writeText(copyText);

      // Alert the copied text
      alert("Sao chép số tài khoản: " + copyText);
    }
  };

  const handleSaveQrCode = () => {
    if (qrUrl) {
      // Create a link element, set its href to the QR code URL, and trigger a click to download
      const link = document.createElement("a");
      link.href = qrUrl;
      link.download = "qr-code.png"; // Set the default filename
      link.click();
    }
  };

  return (
    <div className={cx("qr-view-container")}>
      <div className={cx("qr-view-header")}>
        <div
          className={cx("qr-view-back-button")}
          onClick={() => navigate("/bill")}
        >
          <img src={leftArrow} alt="Back" />
        </div>
        <div className={cx("qr-view-title")}>Mã thanh toán của bạn</div>
        <div></div>
      </div>
      <div className={cx("qr-view-content")}>
        {/* Centered and responsive image */}
        {qrUrl && (
          <img src={qrUrl} alt="QR Code" className={cx("qr-code-image")} />
        )}
      </div>
      {qrUrl && (
        <div className={cx("qr-view-buttons")}>
          <button
            className={cx("copy-account-button")}
            onClick={handleCopyAccountNumber}
          >
            Sao chép số tài khoản
          </button>
          <button className={cx("save-qr-button")} onClick={handleSaveQrCode}>
            Lưu mã QR
          </button>
        </div>
      )}

      {/* <div className={cx("qr-view-footer")}></div> */}
    </div>
  );
}

export default QrView;
