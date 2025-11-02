import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    tags: {
      type: String,
      enum: ["array", "linkedList", "graph", "dp"],
      required: true,
    },
    visibleTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
        explaination: {
          type: String,
          required: true,
        },
      },
    ],
    hiddenTestCases: [
      {
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
      },
    ],
    startCode: [
      {
        language: {
          type: String,
          required: true,
        },
        initialCode: {
          type: String,
          required: true,
        },
      },
    ],
    referenceSolution: [
      {
        language: {
          type: String,
          required: true,
        },
        completeCode: {
          type: String,
          required: true,
        },
      },
    ],
    problemCreator: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    editorial: {
      approach: {
        type: String,
        required: false,
      },
      complexity: {
        time: {
          type: String,
          required: false,
        },
        space: {
          type: String,
          required: false,
        },
      },
      intuition: {
        type: String,
        required: false,
      },
      codingApproach: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model("problem", problemSchema);
export default Problem;
