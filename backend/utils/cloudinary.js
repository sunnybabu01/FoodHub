// import { v2 as cloudinary } from 'cloudinary'
// import fs from "fs"
// const uploadOnCloudinary = async (file) => {
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     });
//     try {
//         const result = await cloudinary.uploader.upload(file)
//         fs.unlinkSync(file)
//         return result.secure_url
//     } catch (error) {
//         fs.unlinkSync(file)
//         console.log(error)
//     }
// }

// export default uploadOnCloudinary





import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 🔹 Configure Cloudinary once at the top
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    // 🧩 Validation: ensure a valid path is provided
    if (!filePath || typeof filePath !== "string") {
      throw new Error("Invalid file path provided to Cloudinary uploader");
    }

    // 🆙 Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // handles all file types (image, video, etc.)
      folder: "uploads", // optional: saves inside a folder on Cloudinary
    });

    // 🧹 Delete local file after successful upload
    fs.unlinkSync(filePath);

    // ✅ Return the uploaded image URL
    return result.secure_url;
  } catch (error) {
    // ❌ Safe cleanup if upload fails
    try {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.error("Error while cleaning up local file:", cleanupError.message);
    }

    console.error("Cloudinary Upload Error:", error.message);
    return null;
  }
};

export default uploadOnCloudinary;
