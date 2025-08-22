import mongoose, { model, Schema } from "mongoose";
import { User } from "./user.models.js";

const tweetSchema = new Schema({
    
    owner : {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content : {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Tweet = model("Tweet", tweetSchema)