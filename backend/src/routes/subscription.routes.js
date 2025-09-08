import { Router } from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/:channelId")
  .post(verifyJWT, toggleSubscription)
  .get(verifyJWT, getUserChannelSubscribers);

router.route("/").get(verifyJWT, getSubscribedChannels);

export default router;
