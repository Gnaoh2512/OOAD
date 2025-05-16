import express from "express";
import { addAppointmentController, replaceAppointmentController, joinAppointmentController, deleteAppointmentController, toggleReminderController } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/appointments", protect, addAppointmentController);

userRouter.put("/appointments/:appointmentId", protect, replaceAppointmentController);

userRouter.put("/appointments/:appointmentId/join", protect, toggleReminderController);

userRouter.post("/appointments/:appointmentId/join", protect, joinAppointmentController);

userRouter.delete("/appointments/:appointmentId", protect, deleteAppointmentController);

export default userRouter;
