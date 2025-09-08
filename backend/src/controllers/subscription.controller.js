import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.models.js";
import mongoose from "mongoose";
import { User } from "../models/user.models.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  //is channelId valid
  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Valid channel ID is required");
  }
  //check if channel exists
  const channelExists = await User.findById(channelId);
  if (!channelExists) {
    throw new ApiError(404, "Channel not found");
  }

  // Prevent self-subscription
  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "Cannot subscribe to your own channel");
  }

  const deletedSubscription = await Subscription.findOneAndDelete({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (deletedSubscription) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { subscribed: false }, "Unfollowed successfully.")
      );
  } else {
    await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, { subscribed: true }, "Followed successfully.")
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Valid channel ID is required");
  }

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriberCount },
        "Subscriber count fetched successfully."
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;

  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "fullName username avatar")
    .select("channel")
    .skip(skip)
    .limit(parseInt(limit))
    .lean(); // Better performance

  const totalCount = await Subscription.countDocuments({
    subscriber: subscriberId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        channels: subscribedChannels,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCount,
          hasNext: skip + parseInt(limit) < totalCount,
        },
      },
      "Subscribed channel fetched successfully"
    )
  );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
