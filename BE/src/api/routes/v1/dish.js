import { Router } from "express";
import { verifyToken } from "../../../middleware/auth.js";
import upload from "../../../middleware/uploadImage.js";
import { createDish, getSearchDishes } from "../../../services/dishServices.js";


const route = Router();


const dishRoutes = (app) => {
    app.use("/dish", route);
    // search all dish
    route.get("/all", async (req, res, next) => {
        try {
            const dishes = await getDishes(req);
            res.status(200).json({ status: 200, listDish: dishes });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid dishes" });
        }
    });
    route.post('/',verifyToken,upload.single('image'), async (req, res, next) => {
        try {
            const newDish = await createDish(req);
            res.status(200).json({ status: 200, newDish: newDish });
        } catch (error) {
            res.status(error.code || 500).json({
                status: error.code || 500,
                message: error.message || "An internal server error occurred",
            });
        }
    });

    route.get("/searchDishes", async (req, res, next) => {
        try {
            const reponesDish = await getSearchDishes(req);
            res.status(200).json({ status: 200, data: reponesDish });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Can't search 3 Dish expensive!!!" });
        }
    });
}
export default dishRoutes

