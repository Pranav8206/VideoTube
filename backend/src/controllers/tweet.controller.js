import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.length < 10) {
    throw new ApiError(400, "Content should be longer than 10 characters.");
  }

  const tweet = await Tweet.create({
    content: content.trim(),
    owner: req.user._id,
  });

  if (!tweet) {
    throw new ApiError(400, "Something went wront! Unable to create tweet.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).select("_id");
  const id = user?._id.toString();

  const tweets = await Tweet.find({ owner: id }).populate(
    "owner",
    "fullName username avatar"
  );

  if (!tweets) {
    throw new ApiError(400, "Something went wrong! Unable to fetch tweets.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User Tweets fetched successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const { _id } = req.user;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet does not exist or has been deleted.");
  }

  if (tweet.owner.toString() !== _id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this tweet.");
  }
  const trimContent = content.trim();
  if (!trimContent) {
    throw new ApiError(400, "Tweet content cannot be empty.");
  }

  if (tweet.content === trimContent) {
    throw new ApiError(
      400,
      "New content must be different from current content."
    );
  }
  tweet.content = trimContent;
  await tweet.save();

  const tweetData = tweet.toObject();
  delete tweetData.owner;
  return res
    .status(200)
    .json(new ApiResponse(200, tweetData, "Tweet updated successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet is not exist or deleted.");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this tweet.");
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully!"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
