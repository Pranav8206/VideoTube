import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Tweet } from "../models/tweet.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video is not exist or deleted");
  }

  const likeExist = await Like.findOneAndDelete({
    likedBy: req.user._id,
    video: videoId,
  });
  if (likeExist) {
    return res
      .status(200)
      .json(new ApiResponse(200, { videoId }, "Video unliked successfully"));
  }

  const like = await Like.create({
    likedBy: req.user._id,
    video: videoId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, like, "Video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId || !mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(400, "Comment not exist or deleted");
  }

  const likeExist = await Like.findOneAndDelete({
    likedBy: req.user._id,
    comment: commentId,
  });
  if (likeExist) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { commentId }, "Comment unliked successfully")
      );
  }

  const like = await Like.create({
    likedBy: req.user._id,
    comment: commentId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, like, "Comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not exist or deleted");
  }

  const likeExist = await Like.findOneAndDelete({
    likedBy: req.user._id,
    tweet: tweetId,
  });
  if (likeExist) {
    return res
      .status(200)
      .json(new ApiResponse(200, { tweetId }, "Tweet unliked successfully"));
  }

  const like = await Like.create({
    likedBy: req.user._id,
    tweet: tweetId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, like, "Tweet like successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideo = await Like.find({
    likedBy: req.user._id,
    video: { $exists: true },
  }).populate("video");

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideo, "Liked video fetch successfully"));
});

const getCommentLikeCount = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId || !mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }
  const likeCount = await Like.countDocuments({
    comment: commentId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { like: likeCount },
        "Comment like fetched successfully"
      )
    );
});

const getTweetLikeCount = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId || !mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }
  const likeCount = await Like.countDocuments({
    tweet: tweetId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { like: likeCount },
        "Tweet like fetched successfully"
      )
    );
});

const getVideoLikeCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }
  const likeCount = await Like.countDocuments({
    video: videoId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { like: likeCount },
        "Video like fetched successfully"
      )
    );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getCommentLikeCount,
  getVideoLikeCount,
  getTweetLikeCount,
};
