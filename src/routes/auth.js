import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { FullName, UserName, emailId, Password } = req.body;
    const passwordHash = await bcrypt.hash(Password, 10);
    const user = new User({
      FullName,
      UserName,
      emailId,
      Password: passwordHash,
    });
    const Save = await user.save();
    const token = await jwt.sign({ _id: user._id }, "DEv@People@123", {
      expiresIn: "1d",
    });
    res.cookie(token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });
    res.json({ message: "Signed Up Successfully", data: Save });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in saving the data", error: err.message });
  }
});

// Signin
authRouter.post("/signin", async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    const user = await User.findOne({ UserName: UserName });

    if (!user) {
      console.log("User not found");
      res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (isMatch) {
      const token = await jwt.sign({ _id: user._id }, "DEv@People@123", {
        expiresIn: "1d",
      });
      res.cookie(token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });
      res.json({ message: "Signed In Successfully" });
    } else {
      console.log("User not found");
      res.status(401).json({ message: "Incorrect password" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error in signing in", error: err.message });
  }
});

export default authRouter;
