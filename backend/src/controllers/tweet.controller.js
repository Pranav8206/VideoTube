import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Tweet } from "../models/tweet.models.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.length < 10) {
    throw new ApiError(400, "Content should be longer than 10 characters.");
  }

  const tweet = await Tweet.create({
    content,
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

  const tweets = await Tweet.findById(username).populate(
    "owner",
    "fullName username avatar"
  );

  if (!tweets) {
    throw new ApiError(400, "Something went wrong! Unable to fetch tweets.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweets, "User Tweets fetched successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(400, "Unable to update tweet.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet updated successfully."));
});

const deleteTweet = asyncHandler (async (req, res)=> {
  const { tweetId } = req.params

  Tweet.findByIdAndDelete(tweetId)

  return res.status(200).json(200, null, "Tweet deleted successfully!" )
})

export { createTweet, getUserTweets, updateTweet, deleteTweet };
