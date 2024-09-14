import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./RequestName.scss";
import clearIcon from "../../assets/image/Icon/close grey.png";
import helloText from "../../assets/image/Icon/hello.png";

const cx = classNames.bind(styles);

function RequestName({
  callback,
  initialUserName = "",
  initialPhoneNumber = "",
}) {
  const [userName, setUserName] = useState(initialUserName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isReady, setIsReady] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    // Set initial values from props or localStorage
    if (initialUserName) setUserName(initialUserName);
    if (initialPhoneNumber) setPhoneNumber(initialPhoneNumber);
  }, [initialUserName, initialPhoneNumber]);

  const handleClearUserName = () => {
    setUserName("");
    localStorage.removeItem("cusName");
  };

  const handleClearPhoneNumber = () => {
    setPhoneNumber("");
    setPhoneError("");
    localStorage.removeItem("cusPhone");
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^0\d{9}$/; // Regex to check if the number starts with 0 and is followed by 9 digits
    return phoneRegex.test(number);
  };

  useEffect(() => {
    if (userName !== "" && validatePhoneNumber(phoneNumber)) {
      setIsReady(true);
      setPhoneError(""); // Clear error if the phone number is valid
    } else {
      setIsReady(false);
      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
        setPhoneError("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      } else {
        setPhoneError("");
      }
    }
  }, [userName, phoneNumber]);

  const handleSubmit = () => {
    if (isReady) {
      localStorage.setItem("cusName", userName);
      localStorage.setItem("cusPhone", phoneNumber);
      if (callback) {
        callback(userName, phoneNumber);
      }
    }
  };

  return (
    <div className={cx("request-name-container")}>
      <div className={cx("welcome-icon")}>
        <img src={helloText} alt="Hello"></img>
      </div>
      <div className={cx("welcome-text")}>Chào mừng bạn đến Bánh Mì Ô Long!</div>
      <div className={cx("welcome-subtext")}>
        Mời bạn nhập tên và số điện thoại để nhà hàng phục vụ bạn nhanh chóng
        hơn, chính xác hơn
      </div>
      <div className={cx("input-container")}>
        <input
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            localStorage.setItem("cusName", e.target.value);
          }}
          placeholder="Nhập tên của bạn"
        />
        {userName && (
          <img src={clearIcon} alt="Clear" onClick={handleClearUserName} />
        )}
      </div>
      <div className={cx("input-container")}>
        <input
          value={phoneNumber}
          maxLength={10}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            localStorage.setItem("cusPhone", e.target.value);
          }}
          placeholder="Nhập số điện thoại của bạn"
        />
        {phoneNumber && (
          <img src={clearIcon} alt="Clear" onClick={handleClearPhoneNumber} />
        )}
        {phoneError && <div className={cx("error-text")}>{phoneError}</div>}
      </div>
      <button
        className={cx("start-button")}
        onClick={handleSubmit}
        disabled={!isReady}
      >
        Bắt đầu
      </button>
    </div>
  );
}

export default RequestName;
