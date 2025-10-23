import express from "express";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  getSolvedProblems,
  submittedProblem,
  updateProblem,
} from "../controllers/problem.controllers.js";
import { userMiddleware } from "../middleware/userMiddleware.js";

const problemRouter = express.Router();

// create  -> admin
problemRouter.post("/create", adminMiddleware, createProblem);

// problem solved by user (must be before /:id route)
problemRouter.get("/user", userMiddleware, getSolvedProblems);

problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem)

// fetch
problemRouter.get("/:id", userMiddleware, getProblemById);
problemRouter.get("/", userMiddleware, getAllProblems);

// update -> admin
problemRouter.put("/:id", adminMiddleware, updateProblem);

// delete -> admin
problemRouter.delete("/:id", adminMiddleware, deleteProblem);

export default problemRouter;
