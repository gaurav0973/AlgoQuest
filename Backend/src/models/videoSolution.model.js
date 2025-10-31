import mongoose, { Schema } from "mongoose"

const videoSchema = new Schema({
    problemId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "problem",
        required: true
    },
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    cloudinaryPublicId:{
        type: String,
        required: true,
        unique: true
    },
    secureUrl:{
        type: String,
        required: true,
        unique: true
    },
    thumbnailUrl:{
        type: String,
        required: true,
        unique: true
    },
    duration:{
        type: Number,
        required: true
    }
}, {
    timestamps:true
})

const VideoSolution = mongoose.model("videoSolution", videoSchema)
export default VideoSolution