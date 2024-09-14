import classNames from "classnames";
import axios from "axios";
import styles from "./bill.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import leftArrow from "../../assets/image/Icon/left-arrow.png";
const cx = classNames.bind(styles);

function Bill() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const phoneNumber = localStorage.getItem("cusPhone") || "";

  useEffect(() => {
    if (!phoneNumber) {
      setError("Không tìm thấy thông tin khách hàng");
      setLoading(false);
      return;
    }

    const fetchOrderHistory = async () => {
      setLoading(true);
      const endDate = new Date().toISOString();
      const startDate = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour before

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/order/all`,
          {
            params: {
              startDate,
              endDate,
              phone_number: phoneNumber,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 200) {
          console.log(response.data.listOrder.currentPage);

          setOrderHistory(response.data.listOrder.currentPage);
        } else {
          setError("Không thể tải lịch sử đơn hàng.");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError("Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [phoneNumber, token]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedOrder(null);
  };

  const handleViewQr = () => {
    if (selectedOrder && selectedOrder.qr_url) {
      navigate("/qrview", { state: { qrUrl: selectedOrder.qr_url } });
    }
  };

  return (
    <div className={cx("page-bill-restaurant")}>
      <div className={cx("bill-top-bar")}>
        <div
          className={cx("bill-return")}
          onClick={() => navigate(`/home/${token}`)}
        >
          <img src={leftArrow} alt="Back"></img>
        </div>
        <div className={cx("bill-title")}>Lịch sử đơn hàng</div>
        <div></div>
      </div>
      <div className={cx("bill-header-area")}></div>
      <div className={cx("bill-content-area")}>
        {loading ? (
          <div className={cx("bill-empty-container")}>
            <p>Đang tải...</p>
          </div>
        ) : error ? (
          <p>{error}</p>
        ) : orderHistory.length === 0 ? (
          <div className={cx("bill-empty-container")}>
            <p>Không có đơn hàng</p>
          </div>
        ) : (
          <ul className={cx("order-history-list")}>
            {orderHistory.map((order, index) => (
              <li
                key={order.id}
                className={cx("order-item")}
                onClick={() => handleOrderClick(order)}
              >
                <div className={cx("order-info")}>
                  <p>
                    <strong>Thời gian tạo:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      // year: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {order.total_price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={cx("bill-footer-area")}></div>

      {showDialog && selectedOrder && (
        <div className={cx("dialog-overlay")}>
          <div className={cx("bill-dialog-container")}>
            <button className={cx("close-button")} onClick={handleCloseDialog}>
              &times;
            </button>
            <h3>Chi tiết đơn hàng</h3>
            <ul className={cx("order-details-list")}>
              {selectedOrder.dishes.map((dish) => (
                <li key={dish.id} className={cx("dish-item")}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className={cx("dish-image")}
                  />
                  <div className={cx("dish-info")}>
                    <p>
                      <strong>{dish.name}</strong> ({dish.orderdishes.quantity}{" "}
                      phần)
                    </p>
                    {dish.orderdishes.option_id && (
                      <p>Option: {dish.orderdishes.option_name}</p>
                    )}
                    <p>
                      Giá:{" "}
                      {(
                        (dish.price + dish.orderdishes.option_price) *
                        dish.orderdishes.quantity
                      ).toLocaleString("vi-VN")}{" "}
                      đ
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {selectedOrder.qr_url && (
              <button className={cx("view-qr-button")} onClick={handleViewQr}>
                Xem mã QR thanh toán
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Bill;
