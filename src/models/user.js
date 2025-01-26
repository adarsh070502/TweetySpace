const mongoose = require("mongoose");
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
      maxLength: 10,
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

module.exports = mongoose.model("User", UserSchema);
