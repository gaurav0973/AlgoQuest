import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import authRouter from "./routes/userAuth.routes.js";
import problemRouter from "./routes/problem.routes.js";
import submitRoute from "./routes/submission.routes.js";
import videoRoute from "./routes/videoSolution.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://13.201.185.74:5173", // Add your production URL
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRoute);
app.use("/video", videoRoute);

const PORT = process.env.PORT || 4000;
connectDB()
  .then(async () => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at : ${PORT}`);
    });
  })
  .catch((err) => console.log(`Error starting the server : ${err.message}`));
