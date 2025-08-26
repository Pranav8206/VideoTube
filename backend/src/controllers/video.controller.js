import { Video } from "../models/video.modles.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadeOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// getAllVideos,
// publishAVideo,
// getVideoById,
// updateVideo,
// deleteVideo,
// togglePublishStatus

//ai uploadVideo,
//   getVideoById,
//   listVideos,
//   updateVideo,
//   deleteVideo,
//   togglePublishStatus,
//   incrementViews,

const getAllVideos = asyncHandler(async (req, res) => {
  //get the number of videos to list
  // get limit from req
  // fetch video from db
  // return array of videos
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const videos = await Video.find()
    .skip(page - 1 * limit)
    .limit(limit)
    ?.sort(([sortBy] = sortType));

  return res
    .status(201)
    .json(new ApiResponse(201, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
   const { title, description} = req.body
   console.log(req.files);
   
   const VideoFilePath = req.files?.video?.[0]?.path
   const ThumbnailFilePath = req.files?.thumbnail?.[0]?.path

  if (!title || !description){
    throw new ApiError(400, "Title and description cannot be empty.")
  } else if (title.length < 10) {
    throw new ApiError(400, "Title must be at least 10 characters long.")
  }

  if (!VideoFilePath || !ThumbnailFilePath) {
    throw new ApiError(400, "Both a video and a thumbnail are required to proceed!")
  }

  const videoInfo = await uploadeOnCloudinary(VideoFilePath)
  const thumbnail = await uploadeOnCloudinary(ThumbnailFilePath)


  if (!videoUrl || !thumbnailUrl){
    throw new ApiError(500, "Failed to  upload media to cloud storage!")
  }
 
  const video = await Video.create({
    videoFile : videoInfo.url,
    thumbnail : thumbnail.url,
    owner : req.user?._id,
    title : title ,
    description : description,
    duration : videoInfo.duration || 0,
    // view : 
  })

  if (!video) {
    throw new ApiError(500, "Failed to  upload video info to DB!")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully!"))

});

export { getAllVideos, publishAVideo };