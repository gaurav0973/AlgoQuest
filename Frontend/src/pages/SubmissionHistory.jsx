import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";
import { Code } from "lucide-react";

function SubmissionHistory({ problemId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`
        );

        if (response?.data?.statusCode === 200) {
          setSubmissions(response.data.data.submissions || []);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError(error.response?.data?.message || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    if (problemId) {
      fetchSubmissions();
    }
  }, [problemId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="loading loading-spinner loading-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error m-4">
        <span>{error}</span>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-base-content/70">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Status</th>
            <th>Language</th>
            <th>Runtime</th>
            <th>Memory</th>
            <th>Test Cases</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td>
                <span
                  className={`badge ${
                    submission.status === "accepted"
                      ? "badge-success"
                      : submission.status === "wrong"
                        ? "badge-error"
                        : submission.status === "error"
                          ? "badge-warning"
                          : "badge-ghost"
                  }`}
                >
                  {submission.status.charAt(0).toUpperCase() +
                    submission.status.slice(1)}
                </span>
              </td>
              <td>{submission.language}</td>
              <td>{submission.runtime.toFixed(2)}ms</td>
              <td>{Math.round(submission.memory / 1024)} KB</td>
              <td>{`${submission.testCasePassed}/${submission.testCaseTotal}`}</td>
              <td>{new Date(submission.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <Code className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Code View Modal */}
      {selectedSubmission && (
        <dialog className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">
              Submission Code - {selectedSubmission.language}
            </h3>
            <div className="bg-base-300 p-4 rounded-lg overflow-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {selectedSubmission.code}
              </pre>
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedSubmission(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

export default SubmissionHistory;
