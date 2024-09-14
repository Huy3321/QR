import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Statistic.scss"; // Assuming you have a separate SCSS or CSS file for styling

function Statistic() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statisticsData, setStatisticsData] = useState([]);
  const [error, setError] = useState(null);

  // Function to fetch statistics data based on selected dates
  const fetchStatisticsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/order`,
        {
          params: {
            startDate: startDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
            endDate: endDate.toISOString().split("T")[0],
          },
        }
      );
      setStatisticsData(response.data.data); // Assuming the API returns data in response.data.data
    } catch (error) {
      setError("Lỗi khi tải dữ liệu.");
      console.error("Error fetching statistics data:", error);
    }
  };

  // Fetch data when startDate or endDate changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchStatisticsData();
    }
  }, [startDate, endDate]);

  return (
    <div className="statistic-container">
      <h1 className="title">Trang thống kê số lượng hàng hoá</h1>
      <div className="date-picker-container">
        <div className="date-picker">
          <label htmlFor="start-date" className="label">
            Từ ngày:
          </label>
          <DatePicker
            id="start-date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker-input"
          />
        </div>
        <div className="date-picker">
          <label htmlFor="end-date" className="label">
            Đến ngày:
          </label>
          <DatePicker
            id="end-date"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker-input"
          />
        </div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="statistics-data">
        {statisticsData.length > 0 ? (
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Tên món ăn</th>
                <th>Đã bán</th>
                <th>Đơn giá</th>
                <th>Tổng tiền</th> {/* New column for total price */}
              </tr>
            </thead>
            <tbody>
              {statisticsData.map((item) => {
                const totalPrice = item.totalQuantity * item.price; // Calculate total price
                return (
                  <tr key={item.dish_id}>
                    <td>{item.name}</td>
                    <td>{item.totalQuantity}</td>
                    <td>
                      {parseInt(item.price, 10).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td>
                      {parseInt(totalPrice, 10).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Không có dữ liệu trong khoảng thời gian này.</p>
        )}
      </div>
    </div>
  );
}

export default Statistic;
