import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import { createProblem, deleteProblem, getAllProblems, getProblemById, getSolvedProblems, updateProblem } from "../controllers/problem.controllers.js"
import { userMiddleware } from "../middleware/userMiddleware.js"

const problemRouter = express.Router()

// create  -> admin
problemRouter.post("/create", adminMiddleware, createProblem)

// fetch
problemRouter.get("/:id", userMiddleware , getProblemById)
problemRouter.get("/", userMiddleware , getAllProblems)

// update -> admin
problemRouter.put("/:id", adminMiddleware , updateProblem)

// delete -> admin
problemRouter.delete("/:id", adminMiddleware , deleteProblem)

// problem solved by user
problemRouter.get("/user", userMiddleware, getSolvedProblems)


export default problemRouter