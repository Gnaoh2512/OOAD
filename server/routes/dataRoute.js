import express from "express";
import { protect } from "../middlewares/auth.js";
import { getAppointmentsByDateController } from "../controllers/dataController.js";

const dataRouter = express.Router();

dataRouter.get("/:date", protect, getAppointmentsByDateController);

export default dataRouter;
