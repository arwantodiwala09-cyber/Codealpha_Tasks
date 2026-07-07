const mongoose =
  require("mongoose");

const projectFileSchema =
  new mongoose.Schema(
    {
      project: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Project",
        required: true,
      },

      uploadedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      fileName: {
        type: String,
        required: true,
      },

      fileUrl: {
        type: String,
        required: true,
      },

      fileType: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ProjectFile",
    projectFileSchema
  );