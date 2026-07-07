const mongoose =
  require("mongoose");

const fileSchema =
  new mongoose.Schema(
    {
      project: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
      },

      uploadedBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // Current File Name
      fileName: {
        type: String,
        required: true,
      },

      // Cloudinary/File URL
      fileUrl: {
        type: String,
        required: true,
      },

      // Cloudinary Public ID
      publicId: {
        type: String,
        required: true,
      },

      // MIME Type
      fileType: {
        type: String,
        default: "",
      },

      // Size in Bytes
      fileSize: {
        type: Number,
        default: 0,
      },

      // Original Uploaded Name
      originalName: {
        type: String,
        default: "",
      },

      // Current Version
      currentVersion: {
        type: Number,
        default: 1,
      },

      // Version History
      versions: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "FileVersion",
        },
      ],

      // Total Downloads
      downloadCount: {
        type: Number,
        default: 0,
      },

      // Last Modification Date
      lastModified: {
        type: Date,
        default: Date.now,
      },

      // Optional Description
      description: {
        type: String,
        default: "",
        trim: true,
      },

      // Soft Delete
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "File",
    fileSchema
  );