




























// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { uploadeOnCloudinary } from "../utils/cloudinary.js";
// import { Video } from "../models/video.modles.js";
// import mongoose from "mongoose";

// // Create/Upload a video
// const uploadVideo = asyncHandler(async (req, res) => {
//   const { title, description } = req.body;
//   const durationFromClient = Number(req.body?.duration) || 0;

//   if (!title || !description) {
//     throw new ApiError(400, "Title and description are required");
//   }

//   const videoLocalPath = req.files?.video?.[0]?.path;
//   const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

//   if (!videoLocalPath || !thumbnailLocalPath) {
//     throw new ApiError(400, "Video file and thumbnail are required");
//   }

//   const videoUrl = await uploadeOnCloudinary(videoLocalPath);
//   const thumbnailUrl = await uploadeOnCloudinary(thumbnailLocalPath);

//   if (!videoUrl || !thumbnailUrl) {
//     throw new ApiError(500, "Failed to upload media to cloud storage");
//   }

//   const newVideo = await Video.create({
//     videoFile: videoUrl,
//     thumbnail: thumbnailUrl,
//     owner: req.user?._id,
//     title,
//     description,
//     duration: durationFromClient,
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, newVideo, "Video uploaded successfully"));
// });

// // Get a single video by id
// const getVideoById = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   if (!mongoose.isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid video id");
//   }

//   const video = await Video.findById(videoId);
//   if (!video) {
//     throw new ApiError(404, "Video not found");
//   }

//   return res.status(200).json(new ApiResponse(200, video, "Video fetched"));
// });

// // List videos with optional filters
// const listVideos = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     search = "",
//     owner,
//     isPublished,
//   } = req.query;

//   const filters = {};
//   if (search) {
//     filters.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { description: { $regex: search, $options: "i" } },
//     ];
//   }
//   if (owner && mongoose.isValidObjectId(owner)) {
//     filters.owner = owner;
//   }
//   if (typeof isPublished !== "undefined") {
//     filters.isPublished = String(isPublished) === "true";
//   }

//   const pageNum = Math.max(1, Number(page));
//   const pageSize = Math.min(50, Math.max(1, Number(limit)));

//   const [items, total] = await Promise.all([
//     Video.find(filters)
//       .sort({ createdAt: -1 })
//       .skip((pageNum - 1) * pageSize)
//       .limit(pageSize),
//     Video.countDocuments(filters),
//   ]);

//   return res.status(200).json(
//     new ApiResponse(200, {
//       items,
//       page: pageNum,
//       limit: pageSize,
//       total,
//       totalPages: Math.ceil(total / pageSize),
//     })
//   );
// });

// // Update a video (metadata and/or thumbnail)
// const updateVideo = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   if (!mongoose.isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid video id");
//   }

//   const video = await Video.findById(videoId);
//   if (!video) {
//     throw new ApiError(404, "Video not found");
//   }
//   if (String(video.owner) !== String(req.user?._id)) {
//     throw new ApiError(403, "Not allowed to update this video");
//   }

//   const { title, description, isPublished } = req.body;
//   const thumbnailLocalPath = req.file?.path || req.files?.thumbnail?.[0]?.path;

//   if (title) video.title = title;
//   if (description) video.description = description;
//   if (typeof isPublished !== "undefined") {
//     video.isPublished = String(isPublished) === "true";
//   }

//   if (thumbnailLocalPath) {
//     const thumbnailUrl = await uploadeOnCloudinary(thumbnailLocalPath);
//     if (!thumbnailUrl) {
//       throw new ApiError(500, "Failed to upload thumbnail");
//     }
//     video.thumbnail = thumbnailUrl;
//   }

//   await video.save();

//   return res.status(200).json(new ApiResponse(200, video, "Video updated"));
// });

// // Delete a video
// const deleteVideo = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   if (!mongoose.isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid video id");
//   }

//   const video = await Video.findById(videoId);
//   if (!video) {
//     throw new ApiError(404, "Video not found");
//   }
//   if (String(video.owner) !== String(req.user?._id)) {
//     throw new ApiError(403, "Not allowed to delete this video");
//   }

//   await Video.findByIdAndDelete(videoId);
//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Video deleted successfully"));
// });

// // Toggle publish status
// const togglePublishStatus = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   if (!mongoose.isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid video id");
//   }

//   const video = await Video.findById(videoId);
//   if (!video) {
//     throw new ApiError(404, "Video not found");
//   }
//   if (String(video.owner) !== String(req.user?._id)) {
//     throw new ApiError(403, "Not allowed to update this video");
//   }

//   video.isPublished = !video.isPublished;
//   await video.save();

//   return res
//     .status(200)
//     .json(new ApiResponse(200, video, "Publish status toggled"));
// });

// // Increment view count
// const incrementViews = asyncHandler(async (req, res) => {
//   const { videoId } = req.params;
//   if (!mongoose.isValidObjectId(videoId)) {
//     throw new ApiError(400, "Invalid video id");
//   }

//   const updated = await Video.findByIdAndUpdate(
//     videoId,
//     { $inc: { view: 1 } },
//     { new: true }
//   );

//   if (!updated) {
//     throw new ApiError(404, "Video not found");
//   }

//   return res.status(200).json(new ApiResponse(200, updated, "View counted"));
// });

// export {
//   uploadVideo,
//   getVideoById,
//   listVideos,
//   updateVideo,
//   deleteVideo,
//   togglePublishStatus,
//   incrementViews,
// };