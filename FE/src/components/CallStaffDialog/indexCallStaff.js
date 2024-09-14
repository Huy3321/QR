import { useState } from "react";
import styles from "./callstaff.scss";
import closeIcon from "../../assets/image/Icon/close-black.png";
import noteIcon from "../../assets/image/Icon/notes.png";
import classNames from "classnames";
import axios from "axios";
const cx = classNames.bind(styles);

const CallStaffDialog = ({ callback, tableId }) => {
  const [note, setNote] = useState("");
  const [selectedActions, setSelectedActions] = useState([]);

  const actions = [
    { action: "Lấy thêm tương cà" },
    { action: "Lấy thêm tương ớt" },
    { action: "Lấy thêm sốt" },
    { action: "Lấy thêm đá lạnh" },
    { action: "Lấy dao dĩa" },
    { action: "Lấy thêm khăn giấy" },
    // Add more actions as needed
  ];

  const toggleAction = (action) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter((item) => item !== action));
    } else {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const handleClose = () => {
    if (typeof callback === "function") {
      callback();
    }
  };

  const handleSendRequest = async () => {
    const combinedActions = selectedActions.join(", ");
    const requestData = {
      note: `${note} ${combinedActions}`, // Combine note with actions
      table_id: tableId,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/v1/employee`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.status === 200) {
        console.log("Success:", response.data);
        alert("Yêu cầu hỗ trợ đã được gửi thành công.");
        handleClose();
      } else {
        alert("Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request. Please try again later.");
    }
  };

  return (
    <div className={cx("callstaff-container")}>
      <div className={cx("cs-close-container")}>
        <img src={closeIcon} alt="CLOSE" onClick={handleClose} />
      </div>
      <div className={cx("cs-title")}>Gọi nhân viên</div>
      <div className={cx("cs-sub-title")}>Bạn cần nhân viên hỗ trợ gì?</div>
      <div className={cx("cs-input-container")}>
        <img src={noteIcon} alt="NOTE" />
        <input
          placeholder="Yêu cầu của bạn là gì?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className={cx("cs-function-title")}>Chọn nhanh</div>
      <div className={cx("cs-quick-action-container")}>
        {actions.map((item, index) => (
          <div
            key={index}
            onClick={() => toggleAction(item.action)}
            className={cx({ selected: selectedActions.includes(item.action) })}
          >
            {item.action}
          </div>
        ))}
      </div>
      <div className={cx("cs-send-request-button")} onClick={handleSendRequest}>
        Gửi yêu cầu
      </div>
    </div>
  );
};

export default CallStaffDialog;
