import express from "express"
import { userMiddleware } from "../middleware/userMiddleware.js"
import { runCode, userSubmission } from "../controllers/submission.controller.js"
const submitRoute = express.Router()


submitRoute.post("/submit/:id", userMiddleware, userSubmission)
submitRoute.post("/run/:id", userMiddleware, runCode)


export default submitRoute