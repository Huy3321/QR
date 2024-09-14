import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RequireAuth from "@auth-kit/react-router/RequireAuth";
//user
import HomePage from "../pages/Home/indexHome";
import Menu from "../pages/Menu/indexMenu.js";
import Order from "../pages/Order/indexOrder.js";
import Bill from "../pages/Bill/indexBill.js";
//admin
import AdminLayout from "../admin/admin_layout/adminLayout.js";
import AdminLoginScreen from "../admin/admin_login_screen/index.js";
import AdminHomePage from "../admin/admin_pages/home/AdminHome.js";
import Category from "../admin/admin_pages/category/index.js";
import TableManagement from "../admin/admin_pages/table_management/index.js";
import OrderManagement from "../admin/admin_pages/order_management/order_management.js";
import OptionCategory from "../admin/admin_pages/option_category/option_category.js";
import CreateProduct from "../admin/admin_pages/create_product/create_product.js";
import ListProduct from "../admin/admin_pages/list_product/list_product.js";
import Evaluate from "../admin/admin_pages/evaluate/evaluate.js";
import QrView from "../pages/QrView/indexQrView.js";
import ChatBotPage from "../pages/ChatBot/indexChatBotPage.js";
import Revenue from "../admin/admin_pages/revenue/revenue.js";
import Statistic from "../admin/admin_pages/statistic/Statistic.js";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home/:token" element={<HomePage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orderdetails" element={<Order />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/adminlogin" element={<AdminLoginScreen />} />
        <Route path="/qrview" element={<QrView />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        {/* Bảo vệ các đường dẫn quản trị sử dụng RequireAuth */}
        <Route
          path="/adminhome/*"
          element={
            <RequireAuth fallbackPath="/adminlogin">
              <AdminLayout>
                <Routes>
                  <Route index element={<AdminHomePage />} />
                  <Route path="category" element={<Category />} />
                  <Route path="table" element={<TableManagement />} />
                  <Route path="order" element={<OrderManagement />} />
                  <Route path="option" element={<OptionCategory />} />
                  <Route path="createproduct" element={<CreateProduct />} />
                  <Route path="listproduct" element={<ListProduct />} />
                  <Route path="evaluate" element={<Evaluate />} />
                  <Route path="revenue" element={<Revenue />} />
                  <Route path="statistic" element={<Statistic />} />
                </Routes>
              </AdminLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
