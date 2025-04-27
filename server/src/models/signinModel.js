import mongoose from "mongoose";

const signinSchema = new mongoose.Schema(
  {
    fullName: {
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
    userName: {
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
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("signinCollection", signinSchema);
