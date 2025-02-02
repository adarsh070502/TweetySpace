import fs from "fs";
import express from "express";
import multer from "multer";
import ImageKit from "imagekit";
import isAuthenticated from "../middlewares/authentication_middleware.js";

const uploadPhotoRouter = express.Router();
const upload = multer({ dest: "./temp_photos/" });

uploadPhotoRouter.post(
  "/upload_photo",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const username = req.body.username;
      const temp_photo_path = `./temp_photos/${req.file.filename}`;

      // initializing imagekit
      var imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_UPLOAD_URL,
      });

      fs.readFile(temp_photo_path, (err, data) => {
        if (err) {
          console.log("Error reading file:", err);
          res
            .status(500)
            .json({ message: "Internal Server Error", error: err });
        }

        // Now you can upload the base64 data
        imagekit
          .upload({
            file: data, // Base64 encoded image content
            fileName: `${username}.jpg`, // Desired file name
          })
          .then((response) => {
            const imagekitUrl = response.url;

            res.status(200).json({
              message: "File uploaded successfully",
              imagekitUrl: imagekitUrl,
            });
          })
          .catch((error) => {
            console.log(error);
            res
              .status(500)
              .json({ message: "Internal Server Error", error: error });
          });
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err });
    } finally {
      const temp_photo_path = `./temp_photos/${req.file.filename}`;
      // Delete the file after processing
      fs.unlink(temp_photo_path, (err) => {
        if (err) {
          console.error("Failed to delete file:", err);
        } else {
          console.log("Temporary file deleted:", temp_photo_path);
        }
      });
    }
  }
);

export default uploadPhotoRouter;
