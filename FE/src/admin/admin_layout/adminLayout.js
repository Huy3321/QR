import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./AdminLayout.css";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import logo2 from "../../assets/image/logo_quan.png";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTableManagementOpen, setIsTableManagementOpen] = useState(false);
  const [isProductManagementOpen, setIsProductManagementOpen] = useState(false);
  const [isOrderManagementOpen, setIsOrderManagementOpen] = useState(false);
  const [isFeedbackAndStatsOpen, setIsFeedbackAndStatsOpen] = useState(false);
  const [isRequestManagementOpen, setRequestManagementOpen] = useState(false);

  const signOut = useSignOut();
  const location = useLocation();
  useEffect(() => {
    // Preserve menu state based on the path
    const path = location.pathname;
    if (path.includes("/adminhome/table")) {
      setIsTableManagementOpen(true);
    } else if (
      path.includes("/adminhome/category") ||
      path.includes("/adminhome/option") ||
      path.includes("/adminhome/createproduct") ||
      path.includes("/adminhome/listproduct")
    ) {
      setIsProductManagementOpen(true);
    } else if (path.includes("/adminhome/order")) {
      setIsOrderManagementOpen(true);
    } else if (
      path.includes("/adminhome/revenue") ||
      path.includes("/adminhome/statistic") ||
      path.includes("/adminhome/evaluate")
    ) {
      setIsFeedbackAndStatsOpen(true);
    } else if (path === "/adminhome") {
      setRequestManagementOpen(true);
    }

    // Optional: Close other menus when one is open to avoid multiple menus open simultaneously
    return () => {
      setIsTableManagementOpen(false);
      setIsProductManagementOpen(false);
      setIsOrderManagementOpen(false);
      setIsFeedbackAndStatsOpen(false);
      setRequestManagementOpen(false);
    };
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleRequestManagement = () => {
    setRequestManagementOpen(!isRequestManagementOpen);
  };

  const toggleProductManagement = () => {
    setIsProductManagementOpen(!isProductManagementOpen);
  };

  const toggleOrderManagement = () => {
    setIsOrderManagementOpen(!isOrderManagementOpen);
  };

  const toggleFeedbackAndStats = () => {
    setIsFeedbackAndStatsOpen(!isFeedbackAndStatsOpen);
  };

  const toggleTableManagement = () => {
    setIsTableManagementOpen(!isTableManagementOpen);
  };

  const getClassActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    signOut();
    window.location.reload();
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-account-info">
          <div className="admin-account-details">
            <p className="admin-name">Admin</p>
            <p className="admin-role">Administrator</p>
          </div>
          <img
            src={logo2}
            alt="Avatar"
            className="admin-avatar"
          />
          <button className="logout-button" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="admin-body">
        <nav className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <ul>
            {/* Quản lý yêu cầu */}
            <li
              className={`sidebar-section-title ${getClassActive(
                "/adminhome"
              )}`}
              onClick={toggleRequestManagement}
            >
              <span>Quản lý yêu cầu</span>
            </li>
            {isRequestManagementOpen && (
              <ul className="sidebar-submenu">
                <li className={` ${getClassActive("/adminhome")}`}>
                  <a href="/adminhome">Gọi nhân viên</a>
                </li>
              </ul>
            )}

            {/* Quản lý bàn */}
            <li
              className={`sidebar-section-title ${getClassActive(
                "/adminhome/table"
              )}`}
              onClick={toggleTableManagement}
            >
              <span>Quản lý bàn</span>
            </li>
            {isTableManagementOpen && (
              <ul className="sidebar-submenu">
                <li className={` ${getClassActive("/adminhome/table")}`}>
                  <a href="/adminhome/table">Danh sách bàn</a>
                </li>
              </ul>
            )}

            {/* Quản lý sản phẩm */}
            <li
              className={`sidebar-section-title ${getClassActive(
                "/adminhome/category"
              )}`}
              onClick={toggleProductManagement}
            >
              <span>Quản lý sản phẩm</span>
            </li>
            {isProductManagementOpen && (
              <ul className="sidebar-submenu">
                <li className={` ${getClassActive("/adminhome/category")}`}>
                  <a href="/adminhome/category">Danh mục</a>
                </li>
                <li className={` ${getClassActive("/adminhome/option")}`}>
                  <a href="/adminhome/option">Tuỳ chọn</a>
                </li>
                <li
                  className={` ${getClassActive("/adminhome/createproduct")}`}
                >
                  <a href="/adminhome/createproduct">Tạo sản phẩm</a>
                </li>
                <li className={` ${getClassActive("/adminhome/listproduct")}`}>
                  <a href="/adminhome/listproduct">Toàn bộ sản phẩm</a>
                </li>
              </ul>
            )}

            {/* Quản lý đơn hàng */}
            <li
              className={`sidebar-section-title ${getClassActive(
                "/adminhome/order"
              )}`}
              onClick={toggleOrderManagement}
            >
              <span>Quản lý đơn hàng</span>
            </li>
            {isOrderManagementOpen && (
              <ul className="sidebar-submenu">
                <li className={` ${getClassActive("/adminhome/order")}`}>
                  <a href="/adminhome/order">Toàn bộ đơn hàng</a>
                </li>
              </ul>
            )}

            {/* Phản hồi và thống kê */}
            <li
              className={`sidebar-section-title ${getClassActive(
                "/adminhome/evaluate"
              )}`}
              onClick={toggleFeedbackAndStats}
            >
              <span>Phản hồi và thống kê</span>
            </li>
            {isFeedbackAndStatsOpen && (
              <ul className="sidebar-submenu">
                <li className={` ${getClassActive("/adminhome/revenue")}`}>
                  <a href="/adminhome/revenue">Doanh thu</a>
                </li>
                <li className={` ${getClassActive("/adminhome/statistic")}`}>
                  <a href="/adminhome/statistic">Sản phẩm</a>
                </li>
                <li className={` ${getClassActive("/adminhome/evaluate")}`}>
                  <a href="/adminhome/evaluate">Khách hàng</a>
                </li>
              </ul>
            )}
          </ul>
        </nav>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};
export default AdminLayout;
