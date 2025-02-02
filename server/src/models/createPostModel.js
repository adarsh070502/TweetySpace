import mongoose from "mongoose";
import validator from "validator";

const postsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    hashtags: [String], // Optional array of hashtags
    media: [
      {
        type: String,
        validate: {
          validator: function (link) {
            if (
              !validator.isURL(link, {
                protocols: ["http", "https"],
                require_protocol: true,
              })
            ) {
              throw new Error("Invalid media URL: " + link); // Throw an explicit error
            }
            return true;
          },
          message: (props) => `Invalid media URL: ${props.value}`,
        },
      },
    ], // Array for image/video URLs
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PostCollection", postsSchema);
