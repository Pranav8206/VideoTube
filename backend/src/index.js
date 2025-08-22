// // require('dotenv').config()

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import connectDB from "./db/index.js";
import { app } from "./app.js";

await connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(err);
      throw err;
    });

    app.get("/", (req, res) => {
      res.send("pranav");
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server listening at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

// Approach 1:-
/*

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";

const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

    app.get("/", (req, res) => {
      res.send("connecteddd");
    });

    app.listen(process.env.PORT, () => {
      console.log(`App listening at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error:", error);
  }
})();

*/
