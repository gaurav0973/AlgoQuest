import jwt from "jsonwebtoken"
import User from "../models/user.model.js"



export const userMiddleware = async(req, res, next)=>{
    try {
        const {token} = req.cookies
        // console.log(token)
        if(!token){
            throw new Error("Token is not present")
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const { _id} = payload

        if(!_id){
            throw new Error("Invalid Token")
        }

        const result  = await User.findById(_id)
        // console.log(result._id)
        if(!result){
            throw new Error("User does not exist")
        }
        req.result = result
        // console.log("Result : ", req.result)
        next()


    } catch (error) {
        res.send(`Error: ${error.message}`)

    }
}