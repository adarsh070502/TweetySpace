import mongoose from "mongoose";
import validator from "validator";

const userPhotosSchema = new mongoose.Schema(
  {
    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
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
    profilePhotoId: {
      type: String,
      required: false,
      unique: true,
      default: null,
    },
    headerPhotoId: {
      type: String,
      required: false,
      unique: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("userPhotosSchema", userPhotosSchema);
