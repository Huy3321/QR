import { Router } from "express";
import { getOrders, updateOrder, createOrder,getDetailtOrder } from "../../../services/orderService.js";


const route = Router();
const orderRoutes = (app) => {
    app.use("/order", route);

    route.get("/all", async (req, res, next) => {
        try {
            const orders = await getOrders(req);
            res.status(200).json({ status: 200, listOrder: orders });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid order" });
            
        }

    })
    route.post("/", async (req, res, next) => {
        // const { status, notes, total_price, table_id } = req.body;
        try {

            const orders = await createOrder(req);
            res.status(200).json({ status: 200, listOrder: orders });

        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid order" });

        }

    })

    route.get("/detail", async (req, res, next) => {
        try {
            const order = await getDetailtOrder(req);
            res.status(200).json({ status: 200, Order: order });
        } catch (error) {
            console.error(error);
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    })

    route.put("/:id/status", async (req, res, next) => {
        try {
            const orders = await updateOrder(req);
            res.status(200).json({ status: 202, listTable: orders.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid updatedTableId" });
        }
    });

}
export default orderRoutes