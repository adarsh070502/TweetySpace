import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
      maxLength: 30,
    },
    UserName: {
      type: String,
      required: true,
      maxLength: 20,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SigninDetails", UserSchema); //load the model name from env: process.env.SIGNUP_COLLECTION_NAME
