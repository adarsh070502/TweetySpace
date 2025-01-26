const mongoose = require("mongoose");

const connectDB = async () => {
  return await mongoose.connect(
    "mongodb+srv://shivasharanya5:GkwsjybxBBws9rKo@cluster0.r0rbr.mongodb.net/TweetySpace"
  );
};

module.exports = connectDB;
