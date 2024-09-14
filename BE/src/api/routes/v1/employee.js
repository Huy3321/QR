import { Router } from "express";
import { createEmployee} from "../../../services/employeeService.js";
import {verifyToken} from "../../../middleware/auth.js";

const route = Router();

const employeeRoutes = (app) => {
    app.use("/employee", route);

    route.post("/", async (req, res, next) => {
        try {
            const employees = await createEmployee (req);
            res.status(200).json({ status: 200, listTable: employees});
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid employees" });
        }
    });
}
export default employeeRoutes