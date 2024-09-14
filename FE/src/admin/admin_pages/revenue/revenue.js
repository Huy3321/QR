import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Revenue.scss"; // Assuming you have a separate SCSS or CSS file for styling
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

function Revenue() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [revenueData, setRevenueData] = useState([]);
  const [error, setError] = useState(null);

  const years = [2021, 2022, 2023, 2024];

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      const startDate = `${selectedYear}-01-01`;
      const endDate = `${selectedYear}-12-31`;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/order/total_price`,
          {
            params: {
              startDate,
              endDate,
            },
          }
        );
        setRevenueData(response.data.data); // Assuming the API returns the data in response.data.data
      } catch (error) {
        setError("Failed to fetch revenue data.");
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, [selectedYear]);

  // Preparing data for the chart
  const months = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Doanh thu",
        data: revenueData.map((item) => item.total_price),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color for total price
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        yAxisID: "y", // Link this dataset to the first Y axis
      },
      {
        label: "Đơn hàng",
        data: revenueData.map((item) => item.orders),
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Red color for orders
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y1", // Link this dataset to the second Y axis
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu",
        },
      },
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false, // Only draw grid lines for one Y axis
        },
        title: {
          display: true,
          text: "Số đơn",
        },
      },
    },
  };

  return (
    <div className="revenue-container">
      <h1 className="title">Doanh thu và hoá đơn</h1>
      <div className="dropdown-container">
        <label htmlFor="year-select" className="label">
          Chọn năm:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
          className="year-select"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="chart-container">
        {revenueData.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <p>Loading revenue data...</p>
        )}
      </div>
    </div>
  );
}

export default Revenue;
