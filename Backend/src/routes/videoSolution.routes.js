import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import { deleteVideoById, getDigitalSignature, saveVideoMetaData } from "../controllers/videoSolution.controllers.js"




const videoRoute = express.Router()



videoRoute.get("/create/:problemId", adminMiddleware, getDigitalSignature)
videoRoute.post("/save", adminMiddleware, saveVideoMetaData)
videoRoute.delete("/delete/:problemId", adminMiddleware, deleteVideoById)

export default videoRoute