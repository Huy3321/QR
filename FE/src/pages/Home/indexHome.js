import React, { useState, useEffect } from "react";
import styles from "./home.scss";
import { useParams, useNavigate } from "react-router-dom";
import classNames from "classnames";
import axios from "axios";
import { Fragment } from "react";
import RequestName from "../../components/RequestName";
import CallStaffDialog from "../../components/CallStaffDialog/indexCallStaff";
import FeedbackDialog from "../../components/FeedbackDialog/indexFeedback";
import InteractionItem from "../../components/InteractionItem/index";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import banner1 from "../../assets/image/banner1.png";
import banner2 from "../../assets/image/banner2.png";
import banner3 from "../../assets/image/banner3.png";
import billing from "../../assets/image/Icon/bill.png";
import comment from "../../assets/image/Icon/comment.png";
import person from "../../assets/image/Icon/user.png";
import food from "../../assets/image/Icon/fast-food.png";
import location from "../../assets/image/Icon/maps-and-flags.png";
import chatbot from "../../assets/image/Icon/chatbot.png";
const cx = classNames.bind(styles);

function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableId, setTableId] = useState(null);
  const [tableName, setTableName] = useState("...");
  const { token } = useParams();
  const [showRequestName, setShowRequestName] = useState(false);
  const [showCallStaffDialog, setShowCallStaffDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const options = {
    delay: 2000,
  };

  useEffect(() => {
    localStorage.setItem("token", token);
    if (token !== "") {
      fetchTableInfo(token);
    }
  }, [token]);

  useEffect(() => {
    const storedName = localStorage.getItem("cusName");
    const storedPhone = localStorage.getItem("cusPhone");
    if (!storedName || !storedPhone) {
      setShowRequestName(true);
    } else {
      setName(storedName);
      setPhone(storedPhone);
    }
  }, [showRequestName]);

  const fetchTableInfo = async (uuid) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/table/${uuid}`
      );

      if (!!response?.data?.listTable) {
        setIsActive(response?.data?.listTable?.status === "active");
        setTableId(response?.data?.listTable?.id);
        setTableName(response?.data?.listTable?.name);
      }
    } catch (error) {
      console.error("Error fetching table information:", error);
    }
  };

  const handleNameSubmitted = (newName, newPhone) => {
    // Save the updated name and phone to local storage
    localStorage.setItem("cusName", newName);
    localStorage.setItem("cusPhone", newPhone);
    setName(newName);
    setPhone(newPhone);
    setShowRequestName(false);
  };

  const handleCloseCallStaffDialog = () => {
    setShowCallStaffDialog(false);
  };

  const handelCloseFeedbackDialog = () => {
    setShowFeedbackDialog(false);
  };

  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay(options)]);

  return (
    <div className={cx("page_home_restaurant")}>
      {showRequestName && (
        <RequestName
          initialUserName={name}
          initialPhoneNumber={phone}
          callback={handleNameSubmitted}
        />
      )}
      {showCallStaffDialog && (
        <Fragment>
          <div
            className={cx("overlay")}
            onClick={handleCloseCallStaffDialog}
          ></div>
          <CallStaffDialog
            callback={handleCloseCallStaffDialog}
            tableId={tableId ?? 1}
          />
        </Fragment>
      )}
      {showFeedbackDialog && (
        <Fragment>
          <div
            className={cx("overlay")}
            onClick={handelCloseFeedbackDialog}
          ></div>
          <FeedbackDialog callback={handelCloseFeedbackDialog} />
        </Fragment>
      )}
      <div className={cx("page--content")}>
        <Fragment>
          <div className={cx("restaurant-info-container")}>
            <div className={cx("name")}>Bánh Mì Ô Long</div>
            <div className={cx("address")}>
              <img src={location} alt="ICON" />
              Địa chỉ: 132 Cổ Nhuế, Bắc Từ Liêm, Hà Nội
            </div>
          </div>
          <div className={cx("banner-container")}>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                <div className="embla__slide">
                  <img src={banner1} alt="Banner 1" />
                </div>
                <div className="embla__slide">
                  <img src={banner2} alt="Banner 2" />
                </div>
                <div className="embla__slide">
                  <img src={banner3} alt="Banner 3" />
                </div>
              </div>
            </div>
          </div>
          <div className={cx("flag-1-1")}>
            <div className={cx("user-info")}>
              <div className={cx("hello")}>Xin chào </div>
              <div
                className={cx("name")}
                onClick={() => setShowRequestName(true)}
              >
                {name}
              </div>
            </div>
            <div className={cx("table-info")}>
              <div className={cx("text")}>
                Chúng tôi sẽ trả đồ cho bạn tại bàn:{" "}
              </div>
              <div className={cx("table")}>{tableName}</div>
            </div>
          </div>
          <div className={cx("interaction--container")}>
            {isActive ? (
              <InteractionItem
                iconName={billing}
                description="Xem hoá đơn"
                backgroundColor="#FFB72B"
                callback={() => navigate("/bill")}
              />
            ) : (
              <div> </div>
            )}

            <InteractionItem
              iconName={person}
              description="Gọi nhân viên"
              backgroundColor="#92B4EC"
              callback={() => setShowCallStaffDialog(true)}
            />
            {isActive ? (
              <InteractionItem
                iconName={comment}
                description="Đánh giá"
                backgroundColor="#AACB73"
                callback={() => setShowFeedbackDialog(true)}
              />
            ) : (
              <div />
            )}
          </div>
          {isActive ? (
            <div
              className={cx("menu-navigate-button")}
              onClick={() => navigate("/menu")}
            >
              <div className={cx("image-icon")}>
                <img src={food} alt="ICON" />
              </div>
              <div className={cx("text-description-menu")}>
                Xem Menu - Gọi món
              </div>
            </div>
          ) : (
            <div className={cx("unactive-table-warning")}>
              Bàn này chưa được bật hoặc sai QR code.
              <br />
              Vui lòng quét lại mã QR trên mặt bàn.
            </div>
          )}

          <div className={cx("chat-icon")} onClick={() => navigate("/chatbot")}>
            <img src={chatbot} alt="Chat with AI" />
          </div>
        </Fragment>
      </div>
    </div>
  );
}

export default HomePage;