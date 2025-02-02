import dotenv from "dotenv";

// Loading env variables
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import followersRouter from "./routes/followers.js";
import uploadPhotoRouter from "./routes/photoUpload.js";
import connectDB from "./config/database.js";

// Creating App
const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // To parse/handle urlencoded data
app.use(express.json()); // To parse/handle json data
app.use(morgan("dev")); // Logging
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/followers", followersRouter);
app.use("/photos", uploadPhotoRouter);

// Connecting to DB and starting server
connectDB()
  .then(() => {
    console.log("Successfully connected to database.");
    app.listen(port, () => {
      console.log(`App is listening to Port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
    process.exit(1);
  });
