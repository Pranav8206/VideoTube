import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
// app.use("/users", userRouter)  not professional way
app.use("/api/v1/users", userRouter); //this follows in production
//http://localhost:3000//api/v1/users/register
//routes declaration

import videoRouter from "./routes/video.routes.js";
app.use("/api/v1/videos", videoRouter);

import tweetRouter from "./routes/tweet.routes.js";
app.use("/api/v1/tweets", tweetRouter);

import subscriptionRouter from "./routes/subscription.routes.js";
app.use("/api/v1/subscription", subscriptionRouter);

import playlistRouter from "./routes/playlist.routes.js";
app.use("/api/v1/playlist", playlistRouter);

import likeRouter from "./routes/like.routes.js";
app.use("/api/v1/like", likeRouter);

import commentRouter from "./routes/comment.routes.js";
app.use("/api/v1/comment", commentRouter);

import dashboardRouter from "./routes/dashboard.routes.js";
app.use("/api/v1/d", dashboardRouter);

import healthcheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRouter);

export { app };
