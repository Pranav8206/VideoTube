import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { userId } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "User Id is invalid");
  }

  const stats = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: { $size: "$videoLikes" } },
      },
    },
  ]);

  const subscribers = await Subscription.countDocuments({ channel: userId });

  const data = {
    views: stats[0]?.totalViews || 0,
    videos: stats[0]?.totalVideos || 0,
    likes: stats[0]?.totalLikes || 0,
    subscribers,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "User Id is invalid");
  }

  const videos = await Video.find({ owner: userId }).select("-videoFile");
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
