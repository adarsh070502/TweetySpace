import express from "express";
import mongoose from "mongoose";
import profiles from "../models/profileModel.js";
import followers from "../models/followersModel.js";
import posts from "../models/createPostModel.js";
import isAuthenticated from "../middlewares/authentication_middleware.js";
import validator from "validator";
const { Types } = mongoose;
const postsRouter = express.Router();

postsRouter.post("/add_post", isAuthenticated, async (req, res) => {
  try {
    const { text, hashtags, media } = req.body;

    // Check if all media URLs are valid
    const invalidUrls = media.filter(
      (url) =>
        !validator.isURL(url, {
          protocols: ["http", "https"],
          require_protocol: true,
        })
    );

    if (invalidUrls.length > 0) {
      return res.status(407).json({
        message: "Invalid media URL(s) detected",
        invalidUrls, // Show which URLs are invalid
      });
    }

    const userProfile = await profiles.findOne({ UserId: req.user._id });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const newPost = new posts({
      content: text,
      username: userProfile.UserName,
      hashtags,
      media, // Use only validated media URLs
    });

    const savedPost = await newPost.save();
    return res.status(201).json({
      message: "Post added successfully",
      Post: savedPost,
    });
  } catch (err) {
    console.log(err);

    // Handle validation error properly
    if (err.name === "ValidationError") {
      return res.status(407).json({
        message: "Invalid media URL",
        error: err.message,
      });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
});

postsRouter.get("/get_posts", isAuthenticated, async (req, res) => {
  try {
    const allPosts = await posts.find().sort({ createdAt: -1 }); // Newest posts first
    return res.status(200).json({
      message: "Posts fetched successfully",
      posts: allPosts,
    });
  } catch (err) {
    console.log("Fetch Posts Error:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err });
  }
});

postsRouter.delete(
  "/delete_post/:postId",
  isAuthenticated,
  async (req, res) => {
    try {
      const { postId } = req.params;

      // Find the post by ID
      const post = await posts.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Find the logged-in user's profile
      const userProfile = await profiles.findOne({ UserId: req.user._id });

      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Check if the logged-in user is the owner of the post
      if (post.username !== userProfile.UserName) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this post" });
      }

      // Delete the post
      await posts.findByIdAndDelete(postId);

      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.log("Delete Post Error:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err });
    }
  }
);

export default postsRouter;
