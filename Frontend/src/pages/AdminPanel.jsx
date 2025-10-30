import { useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";

const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const TAGS = ["array", "linkedList", "graph", "dp"];
const SUPPORTED_LANGUAGES = ["javascript", "java", "c++"];

function AdminPanel() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "array",
    visibleTestCases: [{ input: "", output: "", explaination: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    startCode: [{ language: "javascript", initialCode: "" }],
    referenceSolution: [{ language: "javascript", completeCode: "" }],
  });

  const handleVisibleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.visibleTestCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, visibleTestCases: newTestCases });
  };

  const handleHiddenTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.hiddenTestCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setFormData({ ...formData, hiddenTestCases: newTestCases });
  };

  const handleStartCodeChange = (index, field, value) => {
    const newStartCode = [...formData.startCode];
    newStartCode[index] = { ...newStartCode[index], [field]: value };
    setFormData({ ...formData, startCode: newStartCode });
  };

  const handleReferenceSolutionChange = (index, field, value) => {
    const newSolutions = [...formData.referenceSolution];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    setFormData({ ...formData, referenceSolution: newSolutions });
  };

  const addTestCase = (type) => {
    if (type === "visible") {
      setFormData({
        ...formData,
        visibleTestCases: [
          ...formData.visibleTestCases,
          { input: "", output: "", explaination: "" },
        ],
      });
    } else {
      setFormData({
        ...formData,
        hiddenTestCases: [
          ...formData.hiddenTestCases,
          { input: "", output: "" },
        ],
      });
    }
  };

  const addLanguageTemplate = (type) => {
    if (type === "start") {
      setFormData({
        ...formData,
        startCode: [
          ...formData.startCode,
          { language: "python", initialCode: "" },
        ],
      });
    } else {
      setFormData({
        ...formData,
        referenceSolution: [
          ...formData.referenceSolution,
          { language: "python", completeCode: "" },
        ],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validate arrays before submission
      if (!formData.visibleTestCases?.length) {
        throw new Error("At least one visible test case is required");
      }
      if (!formData.referenceSolution?.length) {
        throw new Error("At least one reference solution is required");
      }

      // Remove any empty test cases or solutions
      const cleanedFormData = {
        ...formData,
        visibleTestCases: formData.visibleTestCases.filter(
          (tc) => tc.input && tc.output && tc.explaination
        ),
        hiddenTestCases: formData.hiddenTestCases.filter(
          (tc) => tc.input && tc.output
        ),
        startCode: formData.startCode.filter(
          (sc) => sc.language && sc.initialCode
        ),
        referenceSolution: formData.referenceSolution.filter(
          (rs) => rs.language && rs.completeCode
        ),
      };

      // Additional validation
      if (!cleanedFormData.visibleTestCases.length) {
        throw new Error("At least one complete visible test case is required");
      }
      if (!cleanedFormData.referenceSolution.length) {
        throw new Error("At least one complete reference solution is required");
      }

      console.log("Submitting data:", cleanedFormData); // Debug log

      const response = await axiosClient.post(
        "/problem/create",
        cleanedFormData
      );
      console.log("Response:", response); // Debug log

      if (response?.data?.statusCode === 201) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          difficulty: "easy",
          tags: "array",
          visibleTestCases: [{ input: "", output: "", explaination: "" }],
          hiddenTestCases: [{ input: "", output: "" }],
          startCode: [{ language: "javascript", initialCode: "" }],
          referenceSolution: [{ language: "javascript", completeCode: "" }],
        });
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-base-content/70">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Problem</h1>

        {success && (
          <div className="alert alert-success mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Problem created successfully!</span>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Basic Information</h2>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter problem title"
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Enter problem description"
                  className="textarea textarea-bordered h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Difficulty</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    required
                  >
                    {DIFFICULTY_LEVELS.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Tag</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    required
                  >
                    {TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Visible Test Cases</h2>

              {formData.visibleTestCases.map((testCase, index) => (
                <div key={index} className="card bg-base-300 mb-4">
                  <div className="card-body">
                    <h3 className="font-semibold">Test Case #{index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Input</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered"
                          value={testCase.input}
                          onChange={(e) =>
                            handleVisibleTestCaseChange(
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Output</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered"
                          value={testCase.output}
                          onChange={(e) =>
                            handleVisibleTestCaseChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Explaination</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered"
                        value={testCase.explaination}
                        onChange={(e) =>
                          handleVisibleTestCaseChange(
                            index,
                            "explaination",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline btn-info"
                onClick={() => addTestCase("visible")}
              >
                Add Visible Test Case
              </button>
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Hidden Test Cases</h2>

              {formData.hiddenTestCases.map((testCase, index) => (
                <div key={index} className="card bg-base-300 mb-4">
                  <div className="card-body">
                    <h3 className="font-semibold">Test Case #{index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Input</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered"
                          value={testCase.input}
                          onChange={(e) =>
                            handleHiddenTestCaseChange(
                              index,
                              "input",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Output</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered"
                          value={testCase.output}
                          onChange={(e) =>
                            handleHiddenTestCaseChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline btn-info"
                onClick={() => addTestCase("hidden")}
              >
                Add Hidden Test Case
              </button>
            </div>
          </div>

          {/* Code Templates */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Starter Code Templates</h2>

              {formData.startCode.map((code, index) => (
                <div key={index} className="card bg-base-300 mb-4">
                  <div className="card-body">
                    <div className="flex flex-col gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Language</span>
                        </label>
                        <select
                          className="select select-bordered w-full"
                          value={code.language}
                          onChange={(e) =>
                            handleStartCodeChange(
                              index,
                              "language",
                              e.target.value
                            )
                          }
                          required
                        >
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Initial Code</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered font-mono"
                          value={code.initialCode}
                          onChange={(e) =>
                            handleStartCodeChange(
                              index,
                              "initialCode",
                              e.target.value
                            )
                          }
                          required
                          rows={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline btn-info"
                onClick={() => addLanguageTemplate("start")}
              >
                Add Language Template
              </button>
            </div>
          </div>

          {/* Reference Solutions */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Reference Solutions</h2>

              {formData.referenceSolution.map((solution, index) => (
                <div key={index} className="card bg-base-300 mb-4">
                  <div className="card-body">
                    <div className="flex flex-col gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Language</span>
                        </label>
                        <select
                          className="select select-bordered w-full"
                          value={solution.language}
                          onChange={(e) =>
                            handleReferenceSolutionChange(
                              index,
                              "language",
                              e.target.value
                            )
                          }
                          required
                        >
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Complete Solution</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered font-mono"
                          value={solution.completeCode}
                          onChange={(e) =>
                            handleReferenceSolutionChange(
                              index,
                              "completeCode",
                              e.target.value
                            )
                          }
                          required
                          rows={8}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline btn-info"
                onClick={() => addLanguageTemplate("reference")}
              >
                Add Reference Solution
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Creating Problem..." : "Create Problem"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
