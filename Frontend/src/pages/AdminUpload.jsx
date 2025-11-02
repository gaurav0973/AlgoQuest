import { useParams } from "react-router";
import { useState } from "react";
import axiosClient from "../utils/axiosClient";
import axios from "axios";

function AdminUpload() {
  const { problemId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        setError("File size should not exceed 100MB");
        event.target.value = null;
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // 1. Get upload configuration from backend
      const configResponse = await axiosClient.get(
        `/video/create/${problemId}`
      );
      if (!configResponse.data.success) {
        throw new Error(
          configResponse.data.message || "Failed to get upload configuration"
        );
      }

      const { cloud_name, upload_preset, folder, public_id } =
        configResponse.data.data;

      console.log("Received upload config:", {
        cloud_name,
        upload_preset,
        folder,
        public_id,
      });

      // 2. Create form data for cloudinary upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", upload_preset);
      formData.append("cloud_name", cloud_name);
      formData.append("folder", folder);
      formData.append("public_id", public_id);
      formData.append("resource_type", "video");
      // ✅ FIX: Validate form data before upload
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // 3. Upload video to Cloudinary with better error handling
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/video/upload`;

      console.log("Uploading to:", cloudinaryUrl);

      const uploadResponse = await axios.post(cloudinaryUrl, formData, {
        headers: {
          // ✅ FIX: Let browser set content-type with boundary
        },
        timeout: 300000, // 5 minutes
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
            console.log(`Upload progress: ${percent}%`);
          }
        },
      });

      console.log("✅ Cloudinary upload success:", uploadResponse.data);

      // 4. Save video metadata to backend
      const saveResponse = await axiosClient.post("/video/save", {
        problemId: problemId,
        cloudinaryPublicId: uploadResponse.data.public_id,
        secureUrl: uploadResponse.data.secure_url,
        cloud_name: cloud_name,
      });

      if (!saveResponse.data.success) {
        throw new Error(
          saveResponse.data.message || "Failed to save video metadata"
        );
      }

      setUploadedVideo(saveResponse.data.data);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("videoInput");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("❌ Upload error:", error);

      // ✅ FIX: Better error messages
      if (error.response) {
        // Cloudinary API error
        const cloudinaryError = error.response.data;
        console.error("Cloudinary error details:", cloudinaryError);
        setError(
          cloudinaryError.error?.message || "Upload failed - Cloudinary error"
        );
      } else if (error.code === "ECONNABORTED") {
        setError(
          "Upload timeout. Please try again with a smaller file or better network."
        );
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to upload video. Please try again.");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload Video Solution</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-base">Select Video File</span>
              <input
                id="videoInput"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90
                  file:cursor-pointer cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading}
              />
            </label>
            <p className="text-sm text-gray-400">Maximum file size: 100MB</p>
          </div>

          {/* Selected file info */}
          {selectedFile && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">
                Selected: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024 / 1024)}MB)
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
              {error}
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

          {/* Success message */}
          {uploadedVideo && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
              Video uploaded successfully!
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors
              ${uploading || !selectedFile ? "bg-gray-700 cursor-not-allowed" : "bg-primary hover:bg-primary/90"}
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
