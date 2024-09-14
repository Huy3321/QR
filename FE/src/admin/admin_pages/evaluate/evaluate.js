import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./evaluate.css"; // Ensure to style accordingly

const Evaluate = () => {
  // Set default start date to 30 days ago and end date to today
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch evaluations from the API
  const fetchEvaluations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/v1/evaluate`,
        {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          },
        }
      );
      if (response.data.status === 200) {
        setEvaluations(response.data.data);
      } else {
        setError("Failed to fetch evaluations.");
      }
    } catch (err) {
      setError("An error occurred while fetching evaluations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, [startDate, endDate]);

  // Function to get the row class based on star rating
  const getRowClassName = (star) => {
    if (parseInt(star) <= 2) {
      return "low-rating"; // Light red background for 1-2 stars
    } else if (parseInt(star) === 5) {
      return "high-rating"; // Light green background for 5 stars
    }
    return ""; // No color change for 3-4 stars
  };

  return (
    <Fragment>
      <div className="evaluate-container">
        <h2>Đánh giá của người dùng</h2>
        <div className="filter-container">
          <div className="filter-group">
            <label htmlFor="startDate">Từ ngày:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="endDate">Đến ngày:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="evaluate-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Thời gian tạo</th>
                <th>Số sao</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation, index) => (
                <tr
                  key={evaluation.id}
                  className={getRowClassName(evaluation.star)}
                >
                  <td>{index + 1}</td>
                  <td>{new Date(evaluation.createdAt).toLocaleString()}</td>
                  <td>{evaluation.star}</td>
                  <td>{evaluation.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Fragment>
  );
};

export default Evaluate;
