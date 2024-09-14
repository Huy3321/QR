import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import "./AdminHome.css"; // Make sure to create this CSS file to style the component
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
const AdminHome = () => {
  const [requests, setRequests] = useState([]); // State to store fetched requests
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors
  const authHeader = useAuthHeader();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/v1/employee`,
          {
            headers: {
              Authorization: authHeader, // Replace with your actual token
            },
          }
        );
        if (response.data.status === 200) {
          setRequests(response.data.listEmployess); // Assuming the data is stored in `data`
        } else {
          setError("Failed to fetch requests.");
        }
      } catch (err) {
        setError("Failed to fetch requests.");
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Số thứ tự</th>
              <th>Ghi chú</th>
              <th>Số bàn</th>
              <th>Thời gian tạo</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request.id}>
                <td>{index + 1}</td>
                <td>{request.note || "Không có"}</td>
                <td>{request.table_name}</td>
                <td>
                  {new Intl.DateTimeFormat("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    // year: "numeric",
                  }).format(new Date(request.createdAt))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Fragment>
  );
};

export default AdminHome;
