import express from "express"
import { getProfile, login, logout, register } from "../controllers/userAuth.controllers.js"


const authRouter = express.Router()



// register
authRouter.post("/register", register)

// login
authRouter.post("/login", login)

// logout
authRouter.post("/logout", logout)

// getProfile
authRouter.get("/getProfile", getProfile)


export default authRouter
