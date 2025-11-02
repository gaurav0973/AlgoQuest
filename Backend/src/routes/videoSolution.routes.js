import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  deleteVideoById,
  getDigitalSignature,
  getVideoByProblemId,
  saveVideoMetaData,
} from "../controllers/videoSolution.controllers.js";

const videoRoute = express.Router();

videoRoute.get("/create/:problemId", adminMiddleware, getDigitalSignature);
videoRoute.post("/save", adminMiddleware, saveVideoMetaData);
videoRoute.delete("/delete/:problemId", adminMiddleware, deleteVideoById);
videoRoute.get("/:problemId", getVideoByProblemId); // Public route to get video solution

export default videoRoute;
