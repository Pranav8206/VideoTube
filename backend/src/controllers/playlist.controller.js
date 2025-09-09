import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, description } = req.body;

  const trimedName = name.trim();
  const trimedDesc = description.trim();

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "User id is invalid");
  }

  if (name.trim().length === 0) {
    throw new ApiError(400, "Name cannot be empty");
  }

  const playlist = await Playlist.create({
    name: trimedName,
    description: trimedDesc,
    owner: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { page = 1, limit = 7 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const userPlaylist = await Playlist.find({ owner: req.user._id })
    .limit(parseInt(limit))
    .skip(skip)
    .lean()
    .populate("videos", "thumbnail title description");

  if (userPlaylist.length === 0) {
    throw new ApiError(200, "Playlist is not created. You can create now");
  }
  const playlistCount = await Playlist.countDocuments({ owner: req.user._id });

  const data = {
    userPlaylist: userPlaylist,
    totalPlaylist: playlistCount,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Playlist fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId)
    .populate("owner", "username fullName avatar")
    .populate("videos", "thumbnail title description");

  if (!playlist) {
    throw new ApiError(404, "Playlist not exist or deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "Playlist not exist or deleted");
  }

  if (playlist.videos.some((id) => id.toString() === videoId)) {
    throw new ApiError(404, "Video already exist in playlist");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not available or deleted");
  }

  playlist.videos.push(video._id);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist."));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist or video ID");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not exist or deleted");
  }

  const videoIndex = playlist.videos.indexOf(videoId);
  if (videoIndex === -1) {
    throw new ApiError(404, "Video not exist in playlist");
  }

  playlist.videos.splice(videoIndex, 1);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed successfully."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not exist or already deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!mongoose.isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  if (name.trim().length === 0 && description.trim().length === 0) {
    throw new ApiError(400, "Name and description cannot be empty");
  }

  const updateData = {};
  if (name && name.trim()) {
    updateData.name = name.trim();
  }
  if (description && description.trim()) {
    updateData.description = description.trim();
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $set: updateData },
    { new: true }
  )
    .populate("owner", "username fullName avatar")
    .populate("videos", "thumbnail title description");

  if (!playlist) {
    throw new ApiError(404, "Playlist not exist or deleted");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
