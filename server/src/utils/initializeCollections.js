import newProfile from "../models/profileModel.js";
import newFollowers from "../models/followersModel.js";

const initializeCollections = async (user) => {
  // Creating and Saving new profile
  const profile = new newProfile({
    UserId: user._id.toString(),
    UserName: user.UserName,
    FullName: user.FullName,
    ProfilePicture: process.env.DEFAULT_PROFILE_PICTURE,
  });
  const profileSave = await profile.save();

  // Creating and saving new followers collection
  const followers = new newFollowers({
    user_id: user._id,
  });
  const followersSave = await followers.save();

  return [profileSave, followersSave];
};

export default initializeCollections;
