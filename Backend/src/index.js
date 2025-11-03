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
      process.env.FRONTEND_URL,
      "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRoute);
app.use("/video", videoRoute);

const PORT = 8888 | process.env.PORT;
connectDB()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server is running at : ${PORT}`);
    });
  })
  .catch((err) => console.log(`Error starting the server : ${err.message}`));
