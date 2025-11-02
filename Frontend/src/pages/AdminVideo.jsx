import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, Upload } from "lucide-react";
import axiosClient from "../utils/axiosClient";

function AdminVideo() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this problem? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      setError(null);
      const response = await axiosClient.delete(`/video/delete/${id}`);
      console.log("Delete response:", response?.data);

      if (response?.data?.success || response?.data?.statusCode === 200) {
        setProblems((prev) => prev.filter((problem) => problem._id !== id));
        setSuccessMessage("Problem deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response?.data?.message || "Failed to delete problem");
      }
    } catch (err) {
      console.error("Error deleting problem:", err.message);
      setError("Failed to delete video as it may not exist.");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/problem");
      if (response?.data?.success) {
        // Transform the problems data to ensure tags are always arrays
        const transformedProblems = (response.data.data.problems || []).map(
          (problem) => ({
            ...problem,
            // Convert tags to array if it's a string or ensure it's an array
            tags:
              typeof problem.tags === "string"
                ? problem.tags.split(",").map((tag) => tag.trim())
                : Array.isArray(problem.tags)
                  ? problem.tags
                  : [],
          })
        );
        console.log("Transformed problems:", transformedProblems);
        setProblems(transformedProblems);
      } else {
        throw new Error(response.data.message || "Failed to fetch problems");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to fetch problems"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Upload or Delete Videos</h1>
            <p className="text-gray-400">
              Manage Solution videos for the problems
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Problems List */}
        {problems.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl">
            <p className="text-gray-400">No problems found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div
                key={problem._id}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{problem.title}</h2>
                    <p className="text-gray-400 mt-1">{problem.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.difficulty === "easy"
                            ? "bg-green-500/20 text-green-400"
                            : problem.difficulty === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                      {Array.isArray(problem.tags) &&
                        problem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/upload/${problem._id}`)}
                      className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                      title="Upload video solution"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      disabled={deletingId === problem._id}
                      className={`p-2 rounded-lg ${
                        deletingId === problem._id
                          ? "bg-gray-700 cursor-not-allowed"
                          : "bg-red-500/10 hover:bg-red-500/20 text-red-500"
                      } transition-colors`}
                      title="Delete video solution"
                    >
                      {deletingId === problem._id ? (
                        <div className="loading loading-spinner loading-xs"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVideo;
