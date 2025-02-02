import express from "express";
import Profile from "../models/profileModel.js"; // Import Profile model
import isAuthenticated from "../middlewares/authentication_middleware.js";

const profileRouter = express.Router();

profileRouter.get("/get_profile", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Get the userId from the decoded JWT token
    // Fetch the profile using userId
    const profile = await Profile.findOne({ UserId: userId });

    if (!profile) {
      console.log("Profile not found");
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

export default profileRouter;
