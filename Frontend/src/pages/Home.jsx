/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { logoutUser } from "../utils/authSlice"

function Home() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <div>
      {/* Navbar */}
      <div className="w-full navbar bg-base-300 px-8 flex justify-between items-center">
        <a className="btn btn-ghost normal-case text-xl">AlgoQuest</a>
        <div>
          <span className="mr-4 font-bold ">Hello, {user?.firstName || "User"}</span>
        </div>
        <div>
          <button 
            className="btn btn-outline btn-primary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.firstName || "User"}!
        </h1>
        <p className="text-lg">This is the home page of AlgoQuest.</p>
      </div>
    </div>
  )
}

export default Home
