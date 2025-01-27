import express from "express";
import newProfile from "../models/profileModel.js";

const profileRouter = express.Router();

profileRouter.get("/get_profile", async (req, res) => {
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
    res.status(500).json({ message: "Internal Server error", error: err });
  }
});

export default profileRouter;
