import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import newUser from "../models/signinModel.js";
import initializeCollections from "../utils/initializeCollections.js";
import isAuthenticated from "../middlewares/authentication_middleware.js";

const authRouter = express.Router();

// Signup
authRouter.post("/signup", async (req, res) => {
  try {
    const { fullName, userName, emailId, password } = req.body;

    // Validate password
    if (!password || password.length < 8) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          {
            field: "password",
            error: "Password must be at least 8 characters long",
          },
        ],
      });
    }

    // Check if password contains at least one letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          {
            field: "password",
            error:
              "Password must contain at least one letter, one number, and one special character (@$!%*?&)",
          },
        ],
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Creating new user in Signup model
    const user = new newUser({
      fullName,
      userName,
      emailId,
      password: passwordHash,
    });

    // Creating new user
    const userSave = await user.save();

    // Initializing profile, followers
    const [profileSave, followersSave] = await initializeCollections(userSave);

    // Providing the authToken cookie
    const authToken = await jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "8h",
      }
    );
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    });

    res.status(200).json({
      message: "Signed Up Successfully",
      Sigin: userSave,
      profile: profileSave,
      followers: followersSave,
    });
  } catch (err) {
    // Validation Error
    if (err.name === "ValidationError") {
      // Extract validation errors
      const errors = Object.values(err.errors).map((error) => ({
        field: error.path,
        error: error.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        errors: errors,
      }); // Send errors to the client
    } else if (err.name === "MongoServerError") {
      if (err.message.includes("duplicate key error")) {
        const regex = "/dup key: { (w+):/";
        const match = err.message.match(/dup key: { (\w+):/);
        res
          .status(400)
          .json({ validationErrors: [`${match[1]} already taken.`] });
      } else {
        res
          .status(400)
          .json({ message: "MongoServerError", error: err.message });
      }
    } else {
      console.log(err.name);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
});

// Signin
authRouter.post("/signin", async (req, res) => {
  try {
    const { userName, emailId, password } = req.body;

    // Extracting the password from db based on username.
    let user;
    if (userName) {
      user = await newUser.findOne({ userName: userName }).select("password");
    } else {
      user = await newUser.findOne({ emailId: emailId }).select("password");
    }

    if (!user) {
      // No User Found
      console.log("User not found");
      res.status(401).json({ message: "Invalid User/Password" });
    } else {
      // Comparing the entered password and actual password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Correct password
        const authToken = await jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("authToken", authToken, {
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          maxAge: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
        });

        res.status(200).json({ message: "Signed In Successfully" });
      } else {
        // Incorrect password
        console.log("Incorrect password");
        res.status(401).json({ message: "Invalid User/Password" });
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

// Signout
authRouter.post("/signout", isAuthenticated, async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

export default authRouter;
