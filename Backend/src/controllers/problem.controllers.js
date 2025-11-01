import {
  getLanguageById,
  submitBatch,
  submitToken,
} from "../utils/problem.utils.js";
import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";
import Submission from "../models/submission.model.js";
import { ApiResponse } from "../utils/api-responce.js";
import VideoSolution from "../models/videoSolution.model.js";

export const createProblem = async (req, res) => {
  // console.log(req.result._id)

  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    referenceSolution,
    problemCreator,
  } = req.body;

  try {
    // checking before storing in DB
    for (const { language, completeCode } of referenceSolution) {
      // source_code :  <- completeCode
      // language_id :  <- ek function banana padega
      // stdin :  <- visibleTestCases me present hai
      // expected_output :  <- visibleTestCases me present hai
      const languageId = getLanguageById(language);

      // Batch submissions -> array
      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);

      // tokens
      const resultToken = submitResult.map((value) => value.token);

      // again api call to get the responce from Judge0
      const testResult = await submitToken(resultToken);
      // console.log(testResult)

      // ab apne ko aa gaya hai responce
      /*
                "language_id": 46,
                "stdout": "hello from Bash\n",
                "status_id": 3,
                "stderr": null,
                "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
            */
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured");
        }
      }
    }

    // we can store this in DB now
    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { problem: userProblem },
          "Problem Saved Successfully"
        )
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!id) {
      throw new Error("Missing ID field");
    }

    const dsaProblem = await Problem.findById(id);
    if (!dsaProblem) {
      throw new Error("The Problem is not present");
    }

    const {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator,
    } = req.body;

    // checking before storing in DB
    for (const { language, completeCode } of referenceSolution) {
      // source_code :  <- completeCode
      // language_id :  <- ek function banana padega
      // stdin :  <- visibleTestCases me present hai
      // expected_output :  <- visibleTestCases me present hai
      const languageId = getLanguageById(language);

      // Batch submissions -> array
      const submissions = visibleTestCases.map((testCase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCase.input,
        expected_output: testCase.output,
      }));

      const submitResult = await submitBatch(submissions);

      // tokens
      const resultToken = submitResult.map((value) => value.token);

      // again api call to get the responce from Judge0
      const testResult = await submitToken(resultToken);

      // ab apne ko aa gaya hai responce
      /*
                "language_id": 46,
                "stdout": "hello from Bash\n",
                "status_id": 3,
                "stderr": null,
                "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
            */
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured");
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      {
        ...req.body,
        problemCreator: req.result._id,
      },
      { runValidators: true, new: true }
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { problem: newProblem },
          "Problem Updated Successfully"
        )
      );
  } catch (error) {
    res.status(401).send("Error : " + error);
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "ID is missing"));
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deleteProblem) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Problem not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deleted: deletedProblem },
          "Problem Deleted Successfully"
        )
      );
  } catch (error) {
    res.status(401).send("Error : " + error);
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "ID is missing"));
    }

    const problem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution"
    );
    // console.log(problem)
    if (!problem) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Problem not found"));
    }

    // videos yahi par fetrch kar le id bhej do 
    const video = await VideoSolution.findOne({problemId : id})
    if(video){
        problem.secureUrl = video.secureUrl
        problem.thumbnailUrl = video.thumbnailUrl
        problem.cloudinaryPublicId = video.cloudinaryPublicId
        problem.duration = video.duration
        return res.status(200)
        .json(new ApiResponse(200, { problem }, "Problem fetched successfully"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { problem }, "Problem fetched successfully"));
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}).select("_id title difficulty tags");
    if (problems.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No problems found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, { problems }, "Problems fetched successfully")
      );
  } catch (error) {
    res.status(400).json(new ApiResponse(400, null, error.message));
  }
};

export const getSolvedProblems = async (req, res) => {
  try {
    const user = await req.result.populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { solved: user.problemSolved },
          "Solved problems fetched successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, `Server Error: ${error.message}`));
  }
};

export const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const submissionByUser = await Submission.find({ userId, problemId });

    if (submissionByUser.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "No submissions yet..."));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { submissions: submissionByUser },
          "Submissions fetched successfully"
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, null, `Server Error: ${error.message}`));
  }
};
