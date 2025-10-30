import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";

const LANGUAGE_OPTIONS = [
  { id: "javascript", name: "JavaScript", languageId: 63 },
  { id: "java", name: "Java", languageId: 62 },
  { id: "c++", name: "C++", languageId: 54 },
];

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  automaticLayout: true,
  wordWrap: "on",
  formatOnType: true,
  formatOnPaste: true,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  hideCursorInOverviewRuler: true,
  renderWhitespace: "selection",
};

function ProblemPage() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching problem with ID:", problemId);

        const response = await axiosClient.get(`/problem/${problemId}`);
        console.log("API Response:", response);

        if (response?.data?.statusCode === 200) {
          const problemData = response.data.data.problem;
          console.log("Problem data:", problemData);

          if (!problemData) {
            throw new Error("Problem data is empty");
          }

          setProblem(problemData);

          // Set initial code from startCode if available
          if (problemData.startCode && Array.isArray(problemData.startCode)) {
            const defaultCode = problemData.startCode.find(
              (sc) => sc.language === selectedLanguage.id
            );
            if (defaultCode) {
              setCode(defaultCode.initialCode);
            } else {
              setCode(`// Write your solution for ${problemData.title} here\n`);
            }
          } else {
            console.log("No startCode array found in problem data");
            setCode("// Write your solution here\n");
          }
        } else {
          throw new Error(
            `Server returned status: ${response?.data?.statusCode}`
          );
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        console.error("Error details:", error.response || error.message);
        setError(error.response?.data?.message || "Failed to load problem");
      } finally {
        setIsLoading(false);
      }
    };

    if (problemId) {
      fetchProblem();
    } else {
      console.log("No problemId provided");
      setError("Problem ID is required");
      setIsLoading(false);
    }
  }, [problemId, selectedLanguage.id]);

  const handleLanguageChange = (e) => {
    const lang = LANGUAGE_OPTIONS.find((l) => l.id === e.target.value);
    setSelectedLanguage(lang);
    // Update code with language-specific starter code if available
    const starterCode = problem?.startCode.find(
      (sc) => sc.language === lang.id
    );
    if (starterCode) {
      setCode(starterCode.initialCode);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await axiosClient.post(`submission/run/${problemId}`, {
        language: selectedLanguage.id,
        code,
      });

      if (response?.data?.statusCode === 200) {
        const results = response.data.data.results;
        // Format the results for display
        const formattedResults = results.map((result, index) => {
          const testCase = problem.visibleTestCases[index];
          return {
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result.stdout?.trim() || "",
            status: result.status_id === 3 ? "Passed" : "Failed",
            time: result.time,
            memory: result.memory,
            error:
              result.stderr || (result.status_id !== 3 ? "Wrong Answer" : null),
          };
        });
        setOutput(formattedResults);
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutput([
        {
          error: true,
          message: error.response?.data?.message || "Error running code",
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        language: selectedLanguage.id,
        code,
      });

      if (response?.data?.statusCode === 201) {
        const submission = response.data.data.submission;
        setOutput({
          status: submission.status,
          testCasesPassed: submission.testCasePassed,
          testCasesTotal: submission.testCaseTotal,
          runtime: submission.runtime,
          memory: submission.memory,
          error: submission.errorMessage,
        });
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput({
        error: true,
        message: error.response?.data?.message || "Error submitting code",
      });
    } finally {
      setIsRunning(false);
    }
  };

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

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-warning">
          <span>Problem not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <div className="bg-base-300 px-4 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <div className="flex items-center gap-4">
          <select
            className="select select-bordered select-sm"
            value={selectedLanguage.id}
            onChange={handleLanguageChange}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            className={`btn btn-primary btn-sm ${isRunning ? "loading" : ""}`}
            onClick={handleRun}
            disabled={isRunning}
          >
            Run
          </button>
          <button
            className={`btn btn-success btn-sm ${isRunning ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={isRunning}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2">
        {/* Left Panel */}
        <div className="border-r border-base-300">
          <div className="tabs w-full px-4 border-b border-base-300">
            <button
              className={`tab tab-bordered ${
                activeTab === "description" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`tab tab-bordered ${
                activeTab === "submissions" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </button>
          </div>

          <div className="p-4 h-[calc(100vh-8rem)] overflow-y-auto">
            {activeTab === "description" ? (
              <div className="prose max-w-none">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`badge ${
                      problem.difficulty === "easy"
                        ? "badge-success"
                        : problem.difficulty === "medium"
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-outline">{problem.tags}</div>
                </div>

                <div className="whitespace-pre-wrap">{problem.description}</div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Example Test Cases:
                  </h3>
                  {problem.visibleTestCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="mb-6 p-4 bg-base-200 rounded-lg"
                    >
                      <div className="mb-2">
                        <span className="font-semibold">Input: </span>
                        <code className="text-sm bg-base-300 px-2 py-1 rounded">
                          {testCase.input}
                        </code>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Output: </span>
                        <code className="text-sm bg-base-300 px-2 py-1 rounded">
                          {testCase.output}
                        </code>
                      </div>
                      <div>
                        <span className="font-semibold">Explanation: </span>
                        {testCase.explaination}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Submissions</h3>
                {/* TODO: Add submissions list here */}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <Editor
            height="70%"
            language={selectedLanguage.id}
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={EDITOR_OPTIONS}
          />

          {/* Output Console */}
          <div className="flex-1 border-t border-base-300 bg-base-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Output:</h3>
            {isRunning ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                <span>Running...</span>
              </div>
            ) : output ? (
              <div className="space-y-4">
                {Array.isArray(output) ? (
                  // Run Code Output
                  output.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        result.error
                          ? "bg-error/10"
                          : result.status === "Passed"
                            ? "bg-success/10"
                            : "bg-warning/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          Test Case {index + 1}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${
                            result.error
                              ? "bg-error/20 text-error"
                              : result.status === "Passed"
                                ? "bg-success/20 text-success"
                                : "bg-warning/20 text-warning"
                          }`}
                        >
                          {result.error ? "Error" : result.status}
                        </span>
                      </div>
                      {!result.error && (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                              <span className="font-semibold">Input:</span>
                              <pre className="text-sm bg-base-300 p-2 rounded mt-1">
                                {result.input}
                              </pre>
                            </div>
                            <div>
                              <span className="font-semibold">
                                Your Output:
                              </span>
                              <pre className="text-sm bg-base-300 p-2 rounded mt-1">
                                {result.actualOutput}
                              </pre>
                            </div>
                          </div>
                          <div className="text-sm text-base-content/70">
                            Time: {result.time}s | Memory:{" "}
                            {Math.round(result.memory / 1024)} KB
                          </div>
                        </>
                      )}
                      {result.error && (
                        <div className="text-error text-sm mt-2">
                          {result.message || result.error}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Submit Code Output
                  <div
                    className={`p-4 rounded-lg ${
                      output.error
                        ? "bg-error/10"
                        : output.status === "accepted"
                          ? "bg-success/10"
                          : "bg-warning/10"
                    }`}
                  >
                    {output.error ? (
                      <div className="text-error text-sm">{output.message}</div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-semibold">
                            Submission Result
                          </span>
                          <span
                            className={`px-2 py-1 rounded ${
                              output.status === "accepted"
                                ? "bg-success/20 text-success"
                                : output.status === "error"
                                  ? "bg-error/20 text-error"
                                  : "bg-warning/20 text-warning"
                            }`}
                          >
                            {output.status === "accepted"
                              ? "Accepted"
                              : output.status === "error"
                                ? "Runtime Error"
                                : "Wrong Answer"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            Test Cases: {output.testCasesPassed} /{" "}
                            {output.testCasesTotal} passed
                          </div>
                          <div>
                            Runtime: {output.runtime.toFixed(3)}s | Memory:{" "}
                            {Math.round(output.memory / 1024)} KB
                          </div>
                          {output.error && (
                            <div className="text-error text-sm mt-2 p-2 bg-error/5 rounded">
                              {output.error}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;
