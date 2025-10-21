import express from "express"
import { adminRegister, getProfile, login, logout, register } from "../controllers/userAuth.controllers.js"
import { userMiddleware } from "../middleware/userMiddleware.js"
import { adminMiddleware } from "../middleware/adminMiddleware.js"


const authRouter = express.Router()



// user-register
authRouter.post("/register", register)
// admin-register
authRouter.post("/admin/register", adminMiddleware, adminRegister)

// login
authRouter.post("/login", login)

// logout
authRouter.get("/logout", userMiddleware, logout)

// getProfile
// authRouter.get("/getProfile",userMiddleware, getProfile)


export default authRouter
