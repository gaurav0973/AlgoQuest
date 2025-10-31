import { v2 as cloudinary } from 'cloudinary'
import { ApiResponse } from '../utils/api-responce';
import Problem from '../models/problem.model';
import VideoSolution from '../models/videoSolution.model';



cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
});


export const getDigitalSignature = async(req, res)=>{

    try {

        const {problemId} = req.params
        
        const userId = req.result._id
        // verify problem existance
        const problem = await Problem.findById(problemId)
        if(!problem){
            return res.status(404).json(new ApiResponse({
                success: false,
                message: "Problem not found"
            }))
        }

        // generate unique public_id for the video 
        const timeStamp = Math.round(new Date().getTime() / 1000)
        const publicId = `video_solutions/${problemId}/${userId}_${timeStamp}`

        // generate digital signature
        const signature = cloudinary.utils.api_sign_request({
            timestamp: timeStamp,
            public_id: publicId,
        }, process.env.CLOUDINARY_API_SECRET)
        
        return res.status(200).json(new ApiResponse({
            success: true,
            message: "Digital signature generated successfully",
            data: {
                signature,
                timeStamp,
                public_id : publicId,
                api_key : process.env.CLOUDINARY_API_KEY,
                cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
                upload_url : `https://api.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
            }
        }))
    } catch (error) {
        return res.status(500).json(new ApiResponse({
            success: false,
            message: "Error generating digital signature",
            error: error.message
        }))
    }

}


export const saveVideoMetaData = async(req, res)=>{
    try {
        const {problemId, cloudinaryPublicId, secureUrl, duration} = req.body

        const userId = req.result._id

        // verify upload by cloudinary 
        const uploadDetails = await cloudinary.api.resource(cloudinaryPublicId, { resource_type: "video" })
        if(!uploadDetails){
            return res.status(400).json(new ApiResponse({
                success: false,
                message: "Video not found in cloudinary"
            }))
        }

        // check if video already exists for the problem and user
        const existingVideo = await VideoSolution.findOne({problemId, userId, cloudinaryPublicId})
        if(existingVideo){
            return res.status(400).json(new ApiResponse({
                success: false,
                message: "Video already exists for this problem and user"
            }))
        }

        // thumbnail url 
        const thumbnailUrl = cloudinary.url(uploadDetails.public_id, { resource_type: "image", format: "jpg", transformation: [ { width: 400, height: 220, crop: "fill" },
            {quality : "auto"},
            { start_offset : "auto" }
         ] })


        //  save to db
        const newVideo = new VideoSolution({
            problemId,
            userId,
            cloudinaryPublicId,
            secureUrl,
            duration : existingVideo.duration || duration,
            thumbnailUrl
        })
        await newVideo.save()

        return res.status(201).json(new ApiResponse({
            success: true,
            message: "Video metadata saved successfully",
            data: {
                id : newVideo._id,
                thumbnailUrl: newVideo.thumbnailUrl,
                duration: newVideo.duration,
                uploadedAt : newVideo.createdAt
            }
        }))

    } catch (error) {
        return res.status(500).json(new ApiResponse({
            success: false,
            message: "Error saving video metadata",
            error: error.message
        }))
    }
}


export const deleteVideoById = async(req, res)=>{
    try {
        
        const {videoId} = req.params


        // delete from db
        const video = await VideoSolution.findByIdAndDelete(videoId)
        if(!video){
            return res.status(404).json(new ApiResponse({
                success: false,
                message: "Video not found"
            }))
        }

        // delete from cloudinary
        await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: "video", invalidate: true })
        
        // send the response
        return res.status(200).json(new ApiResponse({
            success: true,
            message: "Video deleted successfully"
        }))

    } catch (error) {
        return res.status(500).json(new ApiResponse({
            success: false,
            message: "Error deleting video",
            error: error.message
        }))
    }
}
