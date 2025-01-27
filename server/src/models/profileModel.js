import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
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
    Bio: {
      type: String,
      required: false,
      default: "",
    },
    FollowersCount: {
      type: Number,
      required: false,
      default: 0,
    },
    FollowingCount: {
      type: Number,
      required: false,
      default: 0,
    },
    ProfilePicture: {
      type: String,
      required: false,
      validate: {
        validator: function (link) {
          return validator.isURL(link, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: (props) =>
          `Profile picture url: ${props.value} is not a valid URL!`,
      },
      //default: TBD
    },
    HeaderImage: {
      type: String,
      required: false,
      validate: {
        validator: function (link) {
          return validator.isURL(link, {
            protocols: ["http", "https"],
            require_protocol: true,
          });
        },
        message: (props) => `Header image: ${props.value} is not a valid URL!`,
      },
      //default: TBD
    },
    TweetCount: {
      type: Number,
      required: false,
      default: 0,
    },
    DateJoined: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("profilesColleection", profileSchema); //load the model name from env: process.env.SIGNUP_COLLECTION_NAME
