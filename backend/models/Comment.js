const mongoose =
  require("mongoose");

const attachmentSchema =
  new mongoose.Schema(
    {
      fileName: {
        type: String,
        required: true,
      },

      fileUrl: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },

      fileType: {
        type: String,
      },

      fileSize: {
        type: Number,
      },
    },
    {
      _id: false,
    }
  );

const commentSchema =
  new mongoose.Schema(
    {
      task: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Task",
        required: true,
      },

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      text: {
        type: String,
        default: "",
        trim: true,
      },

      attachments: [
        attachmentSchema,
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Comment",
    commentSchema
  );