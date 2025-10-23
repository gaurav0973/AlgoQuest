import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import connectDB from "./config/db.js"
import authRouter from "./routes/userAuth.routes.js"
import problemRouter from "./routes/problem.routes.js"
import submitRoute from "./routes/submission.routes.js"




dotenv.config()


const app = express()


// global pody-parser
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))


app.use("/user", authRouter)
app.use("/problem", problemRouter)
app.use("/submission", submitRoute)





const PORT = 8888 | process.env.PORT
connectDB()
    .then(async ()=>{
        app.listen(PORT, ()=>{
            console.log(`Server is running at : ${PORT}`)
        })
    })
    .catch(err => console.log(`Error starting the server : ${err.message}`))
