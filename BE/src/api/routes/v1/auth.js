import { Router } from "express";
import { verifyRefreshToken } from "../../../middleware/auth.js"
import { register, login, createNewToken } from "../../../services/authService.js"

const route = Router();
const refreshTokenRoutes = (app) => {
  app.use("/auth", route);

  route.post("/register", async (req, res, next) => {
    try {
      const createUser = await register(req);
      res.status(200).json({ status: 200, newUsers: createUser });
    } catch (error) {
      res.status(error.code || 500).json({
        status: error.code || 500,
        message: error.message || "An internal server error occurred",
      });
    }
  });

  route.post("/login", async (req, res, next) => {
    try {
      const token = await login(req);
      res.status(200).json({ status: 200, message: "Login Succesfully!!", data: token });
    } catch (error) {
      res.status(error.code || 500).json({
        status: error.code || 500,
        message: error.message || "An internal server error occurred",
      });
    }
  });
  route.post("/", verifyRefreshToken, async (req, res, next) => {
    try {
      const new_accesstoken_refreshtoken = await createNewToken(req);
      res.status(200).json({ status: 200, message: "AccessToken and RefreshToken created successfully", data: new_accesstoken_refreshtoken });
    } catch (error) {
      res.status(error.code || 500).json({
        status: error.code || 500,
        message: error.message || "Can't create new accesstoken and refreshtoken",
      })
    }
  });

};

export default refreshTokenRoutes