import { Router } from "express";
import express from "express";

const app = express();
const route = Router();

const imageRoute = (app) => {
    app.use("/image", express.static('./uploads'), route);
};
route.get('/', (req, res) => {
    const imagePath = __dirname + 'fileNameImage';
    res.sendFile(imagePath);
});
export default imageRoute
