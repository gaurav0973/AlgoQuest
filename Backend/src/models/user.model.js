import mongoose, { Schema } from "mongoose"


const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 25
    },
    lastName:{
        type:String,
        minLength: 3,
        maxLength: 25
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase:true,
        immutable:true
    },
    password:{
        type:String,
        requiredd:true
    },
    age:{
        type:Number,
        min:6,
        max:80
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default: "user"
    },
    problemSolved:{
        type:[{
            type : Schema.Types.ObjectId,
            ref: "problem"
        }],
        unique: true

    }
},{
    timestamps:true
})


const User = mongoose.model("user", userSchema)
export default User