import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "../utils/api-responce.js";
import Problem from "../models/problem.model.js";
import VideoSolution from "../models/videoSolution.model.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getDigitalSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    //1. verify problem existance
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json(
        new ApiResponse({
          success: false,
          message: "Problem not found",
        })
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          upload_preset: "algoQuest", // Create this in Cloudinary dashboard
          folder: `video_solutions/${problemId}`,
          public_id: `user_${userId}_${Date.now()}`,
        },
        "Upload configuration generated"
      )
    );
  } catch (error) {
    console.error("Upload config error:", error);
    return res.status(500).json(
      new ApiResponse({
        success: false,
        message: "Error generating upload config",
        error: error.message,
      })
    );
  }
};

export const saveVideoMetaData = async (req, res) => {
  try {
    const { problemId, cloudinaryPublicId, secureUrl } = req.body;
    console.log("Request body:", req.body);

    const userId = req.result._id;

    try {
      // Ensure cloudinary config is set
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      // verify upload by cloudinary and get video details
      const uploadDetails = await cloudinary.api.resource(cloudinaryPublicId, {
        resource_type: "video",
      });
      console.log("Cloudinary upload details:", uploadDetails);

      // check if video already exists for the problem and user
      const existingVideo = await VideoSolution.findOne({
        problemId,
        userId,
      });

      if (existingVideo) {
        // Delete the old video from Cloudinary
        await cloudinary.uploader.destroy(existingVideo.cloudinaryPublicId, {
          resource_type: "video",
          invalidate: true,
        });
        // Delete the old video from database
        await VideoSolution.deleteOne({ _id: existingVideo._id });
      }

      // Generate thumbnail URL with better defaults
      const thumbnailUrl = cloudinary.url(uploadDetails.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [
          { width: 400, height: 220, crop: "fill" },
          { quality: "auto" },
          { start_offset: "auto" },
          { fetch_format: "auto" },
        ],
      });

      // Create new video entry with all available metadata
      const newVideo = await VideoSolution.create({
        problemId,
        userId,
        cloudinaryPublicId,
        secureUrl,
        thumbnailUrl,
        duration: uploadDetails.duration || 0,
        fileSize: uploadDetails.bytes,
        format: uploadDetails.format,
        status: "completed",
      });

      return res.status(201).json(
        new ApiResponse(
          201,
          {
            id: newVideo._id,
            thumbnailUrl: newVideo.thumbnailUrl,
            duration: newVideo.duration,
            format: newVideo.format,
            fileSize: Math.round((newVideo.fileSize / 1024 / 1024) * 100) / 100, // Convert to MB with 2 decimal places
            status: newVideo.status,
            uploadedAt: newVideo.createdAt,
          },
          "Video metadata saved successfully"
        )
      );
    } catch (cloudinaryError) {
      console.error("Cloudinary verification error:", cloudinaryError);
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Error verifying video upload with Cloudinary: " +
              (cloudinaryError.message || "Unknown error")
          )
        );
    }
  } catch (error) {
    console.error("Server error:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Error processing video upload: " + (error.message || "Unknown error")
        )
      );
  }
};

export const getVideoByProblemId = async (req, res) => {
  try {
    const { problemId } = req.params;

    const videoSolution = await VideoSolution.findOne({ problemId }).sort({
      createdAt: -1,
    }); // Get the most recent video solution

    if (!videoSolution) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, null, "No video solution found for this problem")
        );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          id: videoSolution._id,
          secureUrl: videoSolution.secureUrl,
          thumbnailUrl: videoSolution.thumbnailUrl,
          duration: videoSolution.duration,
          format: videoSolution.format,
          fileSize:
            Math.round((videoSolution.fileSize / 1024 / 1024) * 100) / 100,
          uploadedAt: videoSolution.createdAt,
        },
        "Video solution fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching video solution:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error fetching video solution"));
  }
};

export const deleteVideoById = async (req, res) => {
  try {
    const { problemId } = req.params;
    // console.log("Problem ID to delete video:", problemId);

    // delete from db
    const video = await VideoSolution.findOneAndDelete({ problemId });
    console.log("Deleted video from DB:", video);
    if (!video) {
      return res.status(404).json(
        new ApiResponse({
          success: false,
          message: "Video not found",
        })
      );
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: "video",
      invalidate: true,
    });

    // send the response
    return res.status(200).json(
      new ApiResponse({
        success: true,
        message: "Video deleted successfully",
      })
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse({
        success: false,
        message: "Error deleting video",
        error: error.message,
      })
    );
  }
};
