/* eslint-disable no-unused-vars */
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axiosClient from "../utils/axiosClient";

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  // upload video on cloudinary
  const onSubmit = async () => {
    if (acceptedFiles.length === 0) {
      setError("VideoFile", {
        type: "manual",
        message: "Video file is required",
      });
      return;
    }

    const file = acceptedFiles[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      //1. get digital signature from backend
      const sigResponse = await axiosClient.get(`/video/create/${problemId}`);
    //   console.log("Signature response:", sigResponse?.data?.statusCode?.data);
      
      const {
        signature,
        timeStamp,
        api_key,
        public_id,
        cloud_name,
        upload_url,
      } = sigResponse.data.statusCode.data

      // 2. create form data for cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timeStamp);
      formData.append("public_id", public_id);
      formData.append("signature", signature); // 3. upload video to cloudinary
      const uploadResponse = await axiosClient.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const cloudinaryData = uploadResponse.data;
      // 4. save video metadata to backend
      const saveResponse = await axiosClient.post(`/video/save/${problemId}`, {
        problemId: problemId,
        secureUrl: cloudinaryData.secure_url,
        thumbnailUrl: cloudinaryData.thumbnail_url,
        cloudinaryPublicId: cloudinaryData.public_id,
        duration: cloudinaryData.duration,
      });
      setUploadedVideo(saveResponse.data.videoSolution);
      reset();
    } catch (error) {
      console.error("Error uploading video:", error.message);
      setError("VideoFile", {
        type: "manual",
        message: error.response?.data?.message || "Video upload failed",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        "video/*": [".mp4", ".avi", ".mov"],
      },
      maxFiles: 1,
      maxSize: 100 * 1024 * 1024, // 100MB
      onDrop: (files) => {
        if (files.length > 0) {
          clearErrors();
          setValue("VideoFile", files);
        }
      },
    });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Video Solution</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/10" : "border-gray-600 hover:border-primary/50"}
            `}
          >
            <input {...getInputProps()} />

            {acceptedFiles.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  Selected file: {acceptedFiles[0].name}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V6"
                    />
                  </svg>
                </div>
                <p className="text-base">
                  Drag and drop your video here, or click to select
                </p>
                <p className="text-sm text-gray-400">
                  Maximum file size: 100MB
                </p>
              </div>
            )}
          </div>

          {/* Error message */}
          {errors.VideoFile && (
            <div className="text-red-500 text-sm">
              {errors.VideoFile.message}
            </div>
          )}

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload success message */}
          {uploadedVideo && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
              Video uploaded successfully!
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={uploading || !acceptedFiles.length}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
              ${
                uploading || !acceptedFiles.length
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }
            `}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default AdminUpload;
