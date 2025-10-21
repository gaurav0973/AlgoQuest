import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js"

const problemRouter = express.Router()

// create  -> admin
problemRouter.post("/create", adminMiddleware, createProblem)

// fetch
problemRouter.get("/:id", fetchProblem)
problemRouter.get("/", getAllProblems)

// update -> admin
problemRouter.patch("/:id", updateProblem)

// delete -> admin
problemRouter.delete("/:id", deleteProblem)

// problem solved by user
problemRouter.get("/user", getSolvedProblems)


export default problemRouter