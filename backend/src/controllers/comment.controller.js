import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 7 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not exist or deleted");
  }

  const comment = await Comment.find({ video: videoId })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments: comment,
        totalComments,
        page: parseInt(page),
        totalPages: Math.ceil(totalComments / limit),
      },
      "Comment fetched successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!videoId || !mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not exist or deleted");
  }

  const comment = await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  if (!content || !content.trim()) {
    throw new ApiError(400, "Comment cannot be empty");
  }
  const comment = await Comment.findOne({
    _id: commentId,
    owner: req.user._id,
  });

  if (!comment) {
    throw new ApiError(404, "Comment is not exist or deleted");
  }

  comment.content = content.trim();
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment is updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId || !mongoose.isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const comment = await Comment.findOne({
    _id: commentId,
  });
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const video = await Video.findById(comment.video);

  if (
    !comment.owner.equals(req.user._id) &&
    !video.owner.equals(req.user._id)
  ) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
