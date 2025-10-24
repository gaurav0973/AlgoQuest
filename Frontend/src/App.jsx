import {Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./utils/authSlice.js";


function App() {


  const {isAuthenticated} = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(checkAuth())
  }, [])


  return (
    <>  
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}
export default App