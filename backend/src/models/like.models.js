import mongoose, { model, Schema } from "mongoose";
import { Comment } from "./comment.models.js";

const likeSchema = new Schema({
    
    comment : {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
    },
    video : {
        type : mongoose.Types.ObjectId,
        ref : "Video"
    },
    likedBy : {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    tweet : {
        type : mongoose.Types.ObjectId,
        ref : "Tweet"
    }
}, {timestamps: true})

export const Like = model("Like", likeSchema)