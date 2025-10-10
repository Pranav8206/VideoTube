import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.use(verifyJWT);

router.route("/stats/:userId").get(getChannelStats);

router.route("/videos/:userId").get(getChannelVideos);
//not using, because modified the fetchAllVideos to fetch using userId
// also create at users/c/:username to fetch user all info because, i forget that this route exist
// be mindful when creating route and write it down for clarity

export default router;
