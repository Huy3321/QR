import { Router } from "express";
import {createCategory,getCategorys,updatedCategory  } from "../../../services/categoryService.js";
import {verifyToken} from "../../../middleware/auth.js";

const route = Router();

const categoryRoutes = (app) => {
    app.use("/category", route);
    //search all category
    route.get("/all",verifyToken, async (req, res, next) => {
        try {
            const categorys = await getCategorys(req);
            res.status(200).json({ status: 200, listTable: categorys });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid categorys" });
        }
    });


    // sua category theo ID
    route.put("/:id", async (req, res, next) => {
        try {
            const upCategory = await updatedCategory(req);
            res.status(200).json({ status: 202, listTable: upCategory.message });
        } catch (error) {
            //   return next(err);
            console.error(error);
            res.status(500).json({ status: 500, message: "invalid updatedTableId" });
        }
    });

    route.post("/", async (req, res, next) => {
        try {
            const category = await createCategory(req);
            res.status(200).json({ status: 200, newCategory: category });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: "Can't create new Category!!!" });
        }
    });

};

export default categoryRoutes