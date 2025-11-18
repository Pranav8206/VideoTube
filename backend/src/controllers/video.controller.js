import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadeOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //get the number of videos to list
  // get limit from req
  // fetch video from db
  // return array of videos
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }
  if (userId) {
    filter.owner = userId;
  }

  // filter.isPublished = true;

  const videos = await Video.find(filter)
    .select("-videoFile")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sortBy]: sortType === "desc" ? -1 : 1 })
    .populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, category, isPublished = true } = req.body;

  //check title is available
  const existingVideo = await Video.findOne({ title });
  if (existingVideo) {
    throw new ApiError(400, "That title is already taken. Choose another one.");
  }

  const VideoFilePath = req.files?.video?.[0]?.path;
  const ThumbnailFilePath = req.files?.thumbnail?.[0]?.path;

  if (!title || !description) {
    throw new ApiError(400, "Title or description cannot be empty.");
  } else if (title.length < 10) {
    throw new ApiError(400, "Title must be at least 10 characters long.");
  }

  if (!VideoFilePath || !ThumbnailFilePath) {
    throw new ApiError(
      400,
      "Both a video and a thumbnail are required to proceed!"
    );
  }

  const videoInfo = await uploadeOnCloudinary(VideoFilePath);
  const thumbnail = await uploadeOnCloudinary(ThumbnailFilePath);

  if (!videoInfo || !thumbnail) {
    throw new ApiError(500, "Failed to  upload media to cloud storage!");
  }

  const video = await Video.create({
    videoFile: videoInfo.url,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
    title,
    description,
    duration: videoInfo.duration || 0,
    category,
    isPublished,
  });

  if (!video) {
    throw new ApiError(500, "Failed to  upload video info to DB!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate(
    "owner",
    "username fullName avatar coverImage"
  );

  if (!video) {
    throw new ApiError(
      400,
      "The requested video is not available or may have been removed."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  let { category } = req.body;
  const thumbnail = req.file?.path;

  console.log(category);

  if (!title || !description) {
    throw new ApiError(400, "Title and description cannot be empty.");
  } else if (title.length < 10) {
    throw new ApiError(400, "Title must be at least 10 characters long.");
  }

  if (typeof category === "string") {
    try {
      category = JSON.parse(category);
    } catch (e) {
      throw new ApiError(400, "Invalid category format");
    }
  }

  if (!Array.isArray(category) || category.length === 0) {
    throw new ApiError(400, "Please select at least one category");
  }

  if (category.length > 5) {
    throw new ApiError(400, "Maximum 5 categories allowed");
  }

  const updateData = { title, description, category };

  if (thumbnail) {
    let uploadedThumbnail = await uploadeOnCloudinary(thumbnail);
    if (!uploadedThumbnail) {
      throw new ApiError(500, "Failed to upload thumbnail to cloud storage!");
    }
    updateData.thumbnail = uploadedThumbnail.url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully."));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish mode toggled successfully"));
});

const incrementVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
  res.status(200).json({ message: "View incremented" });
});

export {
  getAllVideos,
  publishAVideo,
  updateVideo,
  getVideoById,
  deleteVideo,
  togglePublishStatus,
  incrementVideoViews,
};
