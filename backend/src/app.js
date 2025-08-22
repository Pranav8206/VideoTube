import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import 
import userRouter from "./routes/user.routes.js";

//routes declaration
        // app.use("/users", userRouter)  not professional way
app.use("/api/v1/users", userRouter) //this follows in production
//http://localhost:3000//api/v1/users/register
//routes declaration


export { app };