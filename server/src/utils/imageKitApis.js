import fs from "fs";
import ImageKit from "imagekit";
import sharp from "sharp";
import userPhotos from "../models/userPhotosModel.js";

export async function uploadImage(userId, imageType, temp_photo_path, res) {
  // Extracting the height and width of the image provided
  const { width, height } = await sharp(temp_photo_path).metadata();

  // Extracting user profile and checking if it exists
  const userPhotosDoc = await userPhotos.findOne({
    UserId: userId,
  });
  if (!userPhotosDoc) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  // If it is profile photo, photo should be atleast 200x200 pixels
  if (
    imageType === "profile" &&
    (width < 200 || height < 200 || width !== height)
  ) {
    return res.status(400).json({
      error: `Profile photo must be at least 200x200 pixels and square.`,
      providedWidth: width,
      providedHeight: height,
    });
  }

  // If it is header photo, photo should be atleast 1500x500 pixels
  if (imageType === "header" && (width < 1500 || height < 500)) {
    return res.status(400).json({
      error: `Header image must be at least 1500x500 pixels.`,
      providedWidth: width,
      providedHeight: height,
    });
  }

  // initializing imagekit
  var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_UPLOAD_URL,
  });

  // Reading the binary image file from temp_photos folder
  const data = await new Promise((resolve, reject) => {
    fs.readFile(temp_photo_path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  // Uploading the image into the imagekit server
  const imageKitResponse = await imagekit.upload({
    file: data, // Base64 encoded image content
    fileName: `${userId}.jpg`, // Desired file name
  });

  const imagekitUrl = imageKitResponse.url;
  const imageName = imageKitResponse.name;
  const imageId = imageKitResponse.fileId;

  // Save the imageId in userPhotosDoc
  if (imageType === "profile") {
    userPhotosDoc.profilePhotoId = imageId;
  } else {
    userPhotosDoc.headerPhotoId = imageId;
  }
  await userPhotosDoc.save();

  return {
    imagekitUrl: imagekitUrl,
    imageName: imageName,
    imageId: imageId,
  };
}

export async function deleteImage(userId, imageType, res) {
  // initializing imagekit
  var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_DELETE_URL,
  });

  // Extracting user profile and checking if it exists
  const userPhotosDoc = await userPhotos.findOne({
    UserId: userId,
  });
  if (!userPhotosDoc) {
    return res.status(404).json({ message: "User doesn't exist" });
  }

  let imageId;
  if (imageType === "profile") {
    imageId = userPhotosDoc.profilePhotoId;
  } else {
    imageId = userPhotosDoc.headerPhotoId;
  }

  // Check if imageId is null
  if (imageId === null) {
    res
      .status(400)
      .json({ message: `${imageType} photo of the user doesn't exists` });
  }

  // Call the deleteFile method
  imagekit.deleteFile(imageId, (error, result) => {
    if (error) {
      res.status(500).json({ message: "Error deleting image", error: error });
    } else {
      // deleting the image ids from database
      if (imageType === "profile") {
        userPhotosDoc.profilePhotoId = null;
      } else {
        userPhotosDoc.headerPhotoId = null;
      }
      userPhotosDoc.save();
    }
  });
}
