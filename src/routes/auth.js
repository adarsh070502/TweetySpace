const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      .status(400)
      .json({ message: "Error in saving the data", error: err.message });
  }
});
module.exports = authRouter;
