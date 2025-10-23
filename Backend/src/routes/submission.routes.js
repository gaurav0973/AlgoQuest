import express from "express"
import { userMiddleware } from "../middleware/userMiddleware.js"
import { userSubmission } from "../controllers/submission.controller.js"
const submitRoute = express.Router()


submitRoute.post("/submit/:id", userMiddleware, userSubmission)


export default submitRoute