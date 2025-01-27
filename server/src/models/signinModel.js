import mongoose from "mongoose";

const signinSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
      maxLength: 30,
      validate: {
        validator: function (value) {
          return value.length >= 3;
        },
        message: "FullName must be at least 3 characters long",
      },
    },
    UserName: {
      type: String,
      required: true,
      maxLength: 20,
      unique: true,
      validate: {
        validator: function (value) {
          return value.length >= 1;
        },
        message: "UserName must be at least 1 characters long",
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        message: "Invalid email address",
      },
    },
    Password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 1;
        },
        message: "Password must be at least 1 characters long",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("signinCollection", signinSchema); //load the model name from env: process.env.SIGNUP_COLLECTION_NAME
