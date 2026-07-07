const cloudinary =
  require("cloudinary").v2;

require("dotenv").config();

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

  secure: true,
});

// Debug (remove later if desired)
console.log(
  "☁️ Cloudinary Config Loaded:",
  {
    cloud_name:
      process.env.CLOUDINARY_CLOUD_NAME,
    api_key:
      process.env.CLOUDINARY_API_KEY
        ? "Loaded"
        : "Missing",
    api_secret:
      process.env.CLOUDINARY_API_SECRET
        ? "Loaded"
        : "Missing",
  }
);

module.exports =
  cloudinary;