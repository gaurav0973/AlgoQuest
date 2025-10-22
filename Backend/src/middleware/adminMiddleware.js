import jwt from "jsonwebtoken"
import User from "../models/user.model.js"



export const adminMiddleware = async(req, res, next)=>{
    try {
        const {token} = req.cookies
        if(!token){
            throw new Error("Token is not present")
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const { _id} = payload

        if(payload.role != "admin"){
            throw new Error("You are not the admin ")
        }

        if(!_id){
            throw new Error("Invalid Token")
        }

        const result  = await User.findById(_id)
        if(!result){
            throw new Error("User does not exist")
        }
        // console.log("Result : " + result)
        req.result = result
        next()


    } catch (error) {
        res.send("Error : ", error.message)
    }
}