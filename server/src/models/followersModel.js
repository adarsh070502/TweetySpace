import mongoose from "mongoose";

const followersSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profileCollection",
      required: true,
    },
    followers_ids: [
      { type: mongoose.Schema.Types.ObjectId, ref: "profileCollection" },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("followerCollection", followersSchema);
