import mongoose, { Schema } from "mongoose"


const submissionSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    problemId : {
        type: Schema.Types.ObjectId,
        ref : "Problem",
        required : true
    },
    code:{
        type : String,
        required : true
    },
    language:{
        type: String,
        required : true,
        enum : ["javascript", "java", "c++"]
    },
    status:{
        type : String,
        enum : ["pending", "accepted", "wrong", "error"],
        default : "pending"
    },
    runtime:{
        type : Number, //millisec
        default : 0
    },
    memory:{
        type : Number, //kB
        default : 0
    },
    errorMessage:{
        type : String,
        default : ""
    },
    testCasePassed : {
        type : Number,
        default : 0
    },
    testCaseTotal : {
        type : Number,
        default : 0
    }

}, {
    timestamps : true
})

// compound index
//  1 => ascending order
submissionSchema.index({userId : 1, problemId : 1})


const Submission = mongoose.model("submission", submissionSchema)
export default Submission