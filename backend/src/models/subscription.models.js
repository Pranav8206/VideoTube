import mongoose, { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
      validate: {
        validator: function (value) {
          return value.toString() !== this.channel.toString();
        },
        message: "User cannot subscribe to themselves",
      },
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
// For the unique combination of subscriber + channel, using compound index
subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true });

export const Subscription = model("Subscription", subscriptionSchema);
