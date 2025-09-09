import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Tweet } from "../models/tweet.models.js";

const toggleLike = (Model, field) =>
  asyncHandler(async (req, res) => {
    const id = req.params[`${field}Id`];

    if (!id || !mongoose.isValidObjectId(id)) {
      throw new ApiError(400, `Invalid ${field} Id`);
    }

    const doc = await Model.findById(id);
    if (!doc) {
      throw new ApiError(404, `${field} does not exist or has been deleted`);
    }

    const filter = { likedBy: req.user._id, [field]: id };

    const likeExist = await Like.findOneAndDelete(filter);
    if (likeExist) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { [`${field}Id`]: id },
            `${field} unliked successfully`
          )
        );
    }

    const like = await Like.create(filter);

    return res
      .status(201)
      .json(new ApiResponse(201, like, `${field} liked successfully`));
  });

const toggleVideoLike = toggleLike(Video, "video");
const toggleCommentLike = toggleLike(Comment, "comment");
const toggleTweetLike = toggleLike(Tweet, "tweet");

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  }).populate("video", "title thumbnail views owner createdAt");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

const getLikeCount = (field) =>
  asyncHandler(async (req, res) => {
    const id = req.params[`${field}Id`];

    if (!id || !mongoose.isValidObjectId(id)) {
      throw new ApiError(400, `Invalid ${field} Id`);
    }

    const likeCount = await Like.countDocuments({ [field]: id });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { like: likeCount },
          `${field} like count fetched successfully`
        )
      );
  });

const getCommentLikeCount = getLikeCount("comment");
const getTweetLikeCount = getLikeCount("tweet");
const getVideoLikeCount = getLikeCount("video");

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getCommentLikeCount,
  getVideoLikeCount,
  getTweetLikeCount,
};
