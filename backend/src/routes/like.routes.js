import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getCommentLikeCount,
  getVideoLikeCount,
  getTweetLikeCount,
} from "../controllers/like.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/comment/:commentId")
  .post(toggleCommentLike)
  .get(getCommentLikeCount);

router.route("/tweet/:tweetId").post(toggleTweetLike).get(getTweetLikeCount);

router.route("/video/:videoId").post(toggleVideoLike).get(getVideoLikeCount);

router.route("/").get(getLikedVideos);

export default router;
