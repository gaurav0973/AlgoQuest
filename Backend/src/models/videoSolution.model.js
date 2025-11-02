import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      unique: true,
    },
    secureUrl: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnailUrl: {
      type: String,
      required: false, // Making this optional as it will be generated after upload
    },
    duration: {
      type: Number,
      default: 0, // Default value if duration is not available
    },
    fileSize: {
      type: Number,
      required: false,
    },
    format: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

const VideoSolution = mongoose.model("videoSolution", videoSchema);
export default VideoSolution;
