import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error(
    "Cloudinary credentials are missing from the environment variables."
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "songs/audio",
    resource_type: "raw", // For audio files
    allowed_formats: ["mp3", "wav", "ogg", "m4a"],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "songs/images",
    resource_type: "image", // For image files
    allowed_formats: ["png", "jpg", "jpeg"],
  },
});

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      if (file.fieldname === "audioFile") {
        return {
          folder: "songs/audio",
          resource_type: "auto",
          allowed_formats: ["mp3", "wav", "ogg", "m4a"],
        };
      }
      if (file.fieldname === "imageFile") {
        return {
          folder: "songs/images",
          resource_type: "image",
          allowed_formats: ["png", "jpg", "jpeg"],
        };
      }
    },
  }),
}).fields([
  { name: "audioFile", maxCount: 1 },
  { name: "imageFile", maxCount: 1 },
  { name: "profilePicture", maxCount: 1 },
]);

export default upload;
