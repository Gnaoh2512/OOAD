import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import dataRouter from "./routes/dataRoute.js";
import userRouter from "./routes/userRoute.js";

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN, "http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/data", dataRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
