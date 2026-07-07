const mongoose =
  require("mongoose");

const taskActivitySchema =
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
      },

      action: {
        type: String,
        required: true,
      },

      description: {
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
    "TaskActivity",
    taskActivitySchema
  );