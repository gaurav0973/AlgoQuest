import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import {
  FiClock,
  FiHardDrive,
  FiCode,
  FiPlayCircle,
  FiBookOpen,
} from "react-icons/fi";

function EditorialPage() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [videoSolution, setVideoSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("approach"); // ['approach', 'code', 'video']

  useEffect(() => {
    const fetchProblemAndSolution = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch problem details
        const problemResponse = await axiosClient.get(`/problem/${problemId}`);
        if (problemResponse?.data?.statusCode === 200) {
          setProblem(problemResponse.data.data.problem);
        }

        // Fetch video solution if available
        const videoResponse = await axiosClient.get(`/video/${problemId}`);
        if (videoResponse?.data?.statusCode === 200) {
          setVideoSolution(videoResponse.data.data);
        }
      } catch (err) {
        console.error("Error fetching editorial:", err);
        setError(
          err.response?.data?.message || "Failed to load editorial content"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (problemId) {
      fetchProblemAndSolution();
    }
  }, [problemId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <div className="flex flex-col">
            <span className="font-bold">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation header */}
      <div className="border-b border-base-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Link
              to={`/problem/${problemId}`}
              className="btn btn-ghost btn-sm gap-2"
            >
              ← Back to Problem
            </Link>
          </div>
        </div>
      </div>

      {/* Problem title and stats */}
      <div className="bg-base-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-2">{problem?.title}</h1>
          <div className="flex items-center gap-4 text-sm text-base-content/70">
            <div
              className={`badge ${
                problem?.difficulty === "easy"
                  ? "badge-success"
                  : problem?.difficulty === "medium"
                    ? "badge-warning"
                    : "badge-error"
              }`}
            >
              {problem?.difficulty}
            </div>
            <span>{problem?.tags}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "approach" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("approach")}
          >
            <FiBookOpen className="mr-2" />
            Approach
          </button>
          <button
            className={`tab ${activeTab === "code" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            <FiCode className="mr-2" />
            Code
          </button>
          <button
            className={`tab ${activeTab === "video" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            <FiPlayCircle className="mr-2" />
            Video Explanation
          </button>
        </div>

        {/* Tab content */}
        <div className="bg-base-200 rounded-lg p-6">
          {activeTab === "approach" && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Intuition</h2>
                <div className="prose max-w-none">
                  {problem?.editorial?.intuition ||
                    "No intuition provided yet."}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Approach</h2>
                <div className="prose max-w-none">
                  {problem?.editorial?.approach ||
                    "No approach description provided yet."}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Complexity</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-primary" />
                    <span>
                      Time:{" "}
                      {problem?.editorial?.complexity?.time || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiHardDrive className="text-primary" />
                    <span>
                      Space:{" "}
                      {problem?.editorial?.complexity?.space || "Not specified"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "code" && (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Coding Approach</h2>
                <div className="prose max-w-none mb-6">
                  {problem?.editorial?.codingApproach ||
                    "No coding approach provided yet."}
                </div>

                {problem?.referenceSolution?.map((solution, index) => (
                  <div key={index} className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {solution.language}
                    </h3>
                    <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto">
                      <code>{solution.completeCode}</code>
                    </pre>
                  </div>
                ))}
              </section>
            </div>
          )}

          {activeTab === "video" && (
            <div>
              {videoSolution ? (
                <div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-base-300">
                    <video
                      controls
                      className="w-full h-full"
                      poster={videoSolution.thumbnailUrl}
                    >
                      <source src={videoSolution.secureUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-base-content/70">
                    <span>
                      Duration: {Math.floor(videoSolution.duration / 60)}m{" "}
                      {videoSolution.duration % 60}s
                    </span>
                    <span>•</span>
                    <span>Quality: {videoSolution.format?.toUpperCase()}</span>
                    <span>•</span>
                    <span>
                      Size: {Math.round(videoSolution.fileSize * 10) / 10} MB
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiPlayCircle className="mx-auto text-6xl mb-4 text-base-content/30" />
                  <p className="text-base-content/70">
                    Video solution is not available yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorialPage;
