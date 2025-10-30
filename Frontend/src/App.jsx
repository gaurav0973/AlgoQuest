import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./utils/authSlice.js";
import AdminPanel from "./pages/AdminPanel.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";

function App() {


  const {isAuthenticated, loading, user} = useSelector((state) => state.auth);
  console.log("Is Authenticated : ", isAuthenticated)
  console.log("User role : ", user?.role)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(checkAuth())
  }, [dispatch])


  if (loading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}


  return (
    <>  
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Home /> : <Navigate to="/signup" />
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to="/" />: <Login />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated 
              ? <Navigate to="/" />
              : <Signup />
          } 
        />
        <Route
          path="/problem/:problemId"
          element={<ProblemPage />}
        />
        <Route 
          path="/admin" 
          element={
            (isAuthenticated && user?.role === "admin") 
              ? <AdminPanel /> 
              : <Navigate to="/" />
          } 
        />
      </Routes>
    </>
  )
}
export default App