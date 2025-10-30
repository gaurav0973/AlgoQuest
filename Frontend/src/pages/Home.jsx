import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../utils/authSlice"
import { useEffect, useState } from "react"
import axiosClient from "../utils/axiosClient"

// Backend enums for problems
const DIFFICULTY_LEVELS = {
  easy: { label: "Easy", color: "success" },
  medium: { label: "Medium", color: "warning" },
  hard: { label: "Hard", color: "error" },
}

const PROBLEM_TAGS = {
  array: { label: "Array", icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" },
  linkedList: {
    label: "Linked List",
    icon: "M4 7h16v2H4zm4 5h12v2H8zm4 5h8v2h-8z",
  },
  graph: {
    label: "Graph",
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  },
  dp: {
    label: "Dynamic Programming",
    icon: "M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z",
  },
}

function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "All",
    tag: "All",
    status: "All",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [problemsResponse, solvedResponse] = await Promise.all([
          axiosClient.get("/problem"),
          user
            ? axiosClient.get("/problem/user")
            : Promise.resolve({ data: { data: { solved: [] } } }),
        ]);

        if (problemsResponse?.data?.statusCode === 200) {
          setProblems(problemsResponse.data.data.problems || []);
        }

        if (solvedResponse?.data?.statusCode === 200) {
          setSolvedProblems(solvedResponse.data.data.solved || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const filteredData = problems.filter((problem) => {
    const matchesDifficulty =
      filters.difficulty === "All" ||
      problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();

    const matchesTag =
      filters.tag === "All" ||
      problem.tags.toLowerCase() === filters.tag.toLowerCase();

    let matchesStatus = true;
    if (filters.status === "Solved")
      matchesStatus = solvedProblems.some((sp) => sp._id === problem._id);
    else if (filters.status === "Unsolved")
      matchesStatus = !solvedProblems.some((sp) => sp._id === problem._id);

    return matchesDifficulty && matchesTag && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <div className="w-full navbar bg-base-300 px-8 flex justify-between items-center shadow-lg">
        <a className="btn btn-ghost normal-case text-xl">AlgoQuest</a>
        <div>
          <span className="mr-4 font-bold">
            Hello, {user?.firstName || "User"}
          </span>
          <button
            className="btn btn-outline btn-primary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-base-200 p-4 rounded-lg shadow">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Difficulty</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={filters.difficulty}
              onChange={(e) =>
                setFilters({ ...filters, difficulty: e.target.value })
              }
            >
              <option value="All">All</option>
              {Object.entries(DIFFICULTY_LEVELS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tag</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={filters.tag}
              onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
            >
              <option value="All">All</option>
              {Object.entries(PROBLEM_TAGS).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered w-full max-w-xs"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="All">All</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
            </select>
          </div>

          {/* Stats Summary */}
          <div className="stats shadow w-full mt-4">
            <div className="stat">
              <div className="stat-title">Total Problems</div>
              <div className="stat-value text-primary">{problems.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Solved</div>
              <div className="stat-value text-success">
                {solvedProblems.length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Remaining</div>
              <div className="stat-value text-secondary">
                {problems.length - solvedProblems.length}
              </div>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((problem) => (
                <div
                  key={problem._id}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <h2 className="card-title text-lg font-bold hover:text-primary cursor-pointer">
                        {problem.title}
                      </h2>
                      <div
                        className={`badge badge-${DIFFICULTY_LEVELS[problem.difficulty.toLowerCase()]?.color || "info"} gap-2`}
                      >
                        {problem.difficulty}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {problem.tags && (
                        <div className="badge badge-outline gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-4 h-4 stroke-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={PROBLEM_TAGS[problem.tags.toLowerCase()]?.icon}
                            />
                          </svg>
                          {PROBLEM_TAGS[problem.tags.toLowerCase()]?.label ||
                            problem.tags}
                        </div>
                      )}
                      {solvedProblems.some((sp) => sp._id === problem._id) && (
                        <div className="badge badge-success gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-4 h-4 stroke-current"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Solved
                        </div>
                      )}
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary btn-sm">
                        Solve Challenge
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-3xl font-bold text-base-content/50 mb-2">
                  No problems found
                </div>
                <p className="text-base-content/70">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home
