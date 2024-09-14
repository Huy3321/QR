import { Router } from "express";
import { getUsers } from "../../../services/userServices.js";
import {verifyToken} from "../../../middleware/auth.js";

const route = Router();

const userRoutes = (app) => {
  app.use("/user", route);
};

route.get("/", verifyToken, async (req, res, next) => {
  try {
    const users = await getUsers(req);
    res.status(200).json({ status: 200, listUser: users });
  } catch (error) {
    //   return next(err);
    console.error(error);
    res.status(500).json({ status: 500, message: "invalid users" });
  }
});

export default userRoutes;
