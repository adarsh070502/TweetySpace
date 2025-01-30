import express from "express";
import mongoose from "mongoose";
import newProfile from "../models/profileModel.js";
import Followers from "../models/followersModel.js";
import isAuthenticated from "../middlewares/authentication_middleware.js";

const { Types } = mongoose;
const profileRouter = express.Router();

profileRouter.get("/get_profile", isAuthenticated, async (req, res) => {
  try {
    const { UserName, UserId } = req.body;

    let profile;
    if (UserName) {
      profile = await newProfile.findOne({ UserName: UserName });
    } else {
      profile = await newProfile.findOne({ UserId: UserId });
    }

    if (!profile) {
      // No User Found
      console.log("User not found");
      res.status(401).json({ message: "User not found" });
    } else {
      res.status(200).json({ profile });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

profileRouter.post("/add_follower", isAuthenticated, async (req, res) => {
  try {
    const { userId, followerId } = req.body;

    // converting string userId, followerId into objectID
    const userObjectId = new Types.ObjectId(userId);
    const followerObjectId = new Types.ObjectId(followerId);

    // Extracting follower profile and checking if it exists
    const followerProfile = await newProfile.findOne({ UserId: followerId });
    if (!followerProfile) {
      return res.status(404).json({ message: "Follower doesn't exist" });
    }

    // Fetching the followersDoc of the user from followersCollection
    let followersDoc = await Followers.findOne({ user_id: userObjectId });
    if (!followersDoc) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Check if the follower is already in the followers list
    if (followersDoc.followers_ids.includes(followerObjectId)) {
      return res.status(409).json({ message: "Follower already exists" });
    }

    // Add the follower and save the document
    followersDoc.followers_ids.push(followerObjectId);
    await followersDoc.save();

    // Update the followers count in profile collection
    const updatedProfile = await newProfile.findOneAndUpdate(
      { UserId: userId }, // Find user by ID
      { $inc: { FollowersCount: 1 } }, // Increment FollowersCount by 1
      { new: true } // Return updated document
    );

    res.status(200).json({
      message: "Follower added successfully",
      updatedUserProfile: updatedProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

profileRouter.get("/get_followers", isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;

    // conevrting string userId into objectID
    const userObjectId = new Types.ObjectId(userId);

    // Check if userid exists
    let followersDoc = await Followers.findOne({ user_id: userObjectId });
    if (!followersDoc) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const followersData = await Followers.findOne({
      user_id: userObjectId,
    }).populate({
      path: "followers_ids", // Field in Followers collection to populate
      model: "profileCollection", // Model to populate from (profileCollection)
      foreignField: "UserId", // Field in profileCollection to match against
      localField: "followers_ids", // Field in Followers collection that stores the follower IDs
      select: "UserName FullName Bio", // Select the fields you want to populate
    });
    res.status(200).json({ data: followersData });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

profileRouter.post("/delete_follower", isAuthenticated, async (req, res) => {
  try {
    const { userId, followerId } = req.body;

    // converting string userId, followerId into objectID
    const userObjectId = new Types.ObjectId(userId);
    const followerObjectId = new Types.ObjectId(followerId);

    // Extracting follower profile and checking if it exists
    const followerProfile = await newProfile.findOne({ UserId: followerId });
    if (!followerProfile) {
      return res.status(404).json({ message: "Follower doesn't exist" });
    }

    // Fetching the followersDoc of the user from followersCollection
    let followersDoc = await Followers.findOne({ user_id: userObjectId });
    if (!followersDoc) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Check if the follower is in the followers list
    if (!followersDoc.followers_ids.includes(followerObjectId)) {
      return res
        .status(400)
        .json({ message: "Follower is not following User" });
    }

    // Deleting the follower
    followersDoc.followers_ids = followersDoc.followers_ids.filter(
      (id) => id.toString() !== followerId
    );

    // Update the followers count in profile collection
    const updatedProfile = await newProfile.findOneAndUpdate(
      { UserId: userId }, // Find user by ID
      { $inc: { FollowersCount: -1 } }, // Increment FollowersCount by 1
      { new: true } // Return updated document
    );

    await followersDoc.save();
    res
      .status(200)
      .json({
        message: "Successfully unfollowed the user.",
        updatedUserProfile: updatedProfile,
      });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

export default profileRouter;
