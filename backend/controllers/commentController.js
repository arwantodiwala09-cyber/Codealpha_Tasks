const Comment =
  require("../models/Comment");

const Task =
  require("../models/Task");

const User =
  require("../models/User");

const Notification =
  require("../models/Notification");

const cloudinary =
  require("../config/cloudinary");

const streamifier =
  require("streamifier");

const {
  getIO,
} = require(
  "../socket/socket"
);

const uploadToCloudinary =
  (file) => {
    return new Promise(
      (
        resolve,
        reject
      ) => {
        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "taskflow/comments",
              resource_type:
                "auto",
            },
            (
              error,
              result
            ) => {
              if (
                error
              ) {
                reject(
                  error
                );
              } else {
                resolve(
                  result
                );
              }
            }
          );

        streamifier
          .createReadStream(
            file.buffer
          )
          .pipe(stream);
      }
    );
  };

// Create Comment
const createComment =
  async (
    req,
    res
  ) => {
    try {
      const {
        taskId,
        text = "",
      } = req.body;

      if (
        !taskId
      ) {
        return res
          .status(400)
          .json({
            message:
              "Task ID is required",
          });
      }

      const task =
        await Task.findById(
          taskId
        );

      if (
        !task
      ) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      const uploadedFiles =
        [];

      if (
        req.files &&
        req.files
          .length > 0
      ) {
        for (
          const file of req.files
        ) {
          const result =
            await uploadToCloudinary(
              file
            );

          uploadedFiles.push(
            {
              fileName:
                file.originalname,

              fileUrl:
                result.secure_url,

              publicId:
                result.public_id,

              fileType:
                file.mimetype,

              fileSize:
                file.size,
            }
          );
        }
      }

      const hasText =
        text &&
        text.trim()
          .length > 0;

      const hasFiles =
        uploadedFiles.length >
        0;

      if (
        !hasText &&
        !hasFiles
      ) {
        return res
          .status(400)
          .json({
            message:
              "Comment must contain text or attachment",
          });
      }

      const comment =
        await Comment.create(
          {
            task:
              taskId,

            user:
              req.user
                ._id,

            text,

            attachments:
              uploadedFiles,
          }
        );

      // Task Comment Notification
      if (
        task.assignedTo &&
        task.assignedTo.toString() !==
          req.user._id.toString()
      ) {
        const notification =
          await Notification.create(
            {
              user:
                task.assignedTo,

              message: `${req.user.name} commented on "${task.title}"`,

              type:
                "task_comment",
            }
          );

        try {
          getIO().emit(
            "newNotification",
            notification
          );
        } catch (
          err
        ) {
          console.error(
            "Notification Socket Error:",
            err.message
          );
        }
      }

      // @Mentions
      const mentionRegex =
        /@([a-zA-Z0-9_]+)/g;

      const mentions =
        text.match(
          mentionRegex
        ) || [];

      for (
        const mention of mentions
      ) {
        const username =
          mention.replace(
            "@",
            ""
          );

        const mentionedUser =
          await User.findOne(
            {
              name: {
                $regex:
                  new RegExp(
                    `^${username}$`,
                    "i"
                  ),
              },
            }
          );

        if (
          mentionedUser &&
          mentionedUser._id.toString() !==
            req.user._id.toString()
        ) {
          const mentionNotification =
            await Notification.create(
              {
                user:
                  mentionedUser._id,

                message: `${req.user.name} mentioned you in a comment`,

                type:
                  "mention",
              }
            );

          try {
            getIO().emit(
              "newNotification",
              mentionNotification
            );
          } catch (
            err
          ) {
            console.error(
              err.message
            );
          }
        }
      }

      const populatedComment =
        await Comment.findById(
          comment._id
        ).populate(
          "user",
          "name email role"
        );

      try {
        getIO().emit(
          "newComment",
          populatedComment
        );
      } catch (
        err
      ) {
        console.error(
          "Socket Emit Error:",
          err.message
        );
      }

      res
        .status(201)
        .json(
          populatedComment
        );
    } catch (
      error
    ) {
      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

// Get Comments By Task
const getCommentsByTask =
  async (
    req,
    res
  ) => {
    try {
      const comments =
        await Comment.find(
          {
            task:
              req.params
                .taskId,
          }
        )
          .populate(
            "user",
            "name email role"
          )
          .sort({
            createdAt:
              -1,
          });

      res.json(
        comments
      );
    } catch (
      error
    ) {
      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

// Delete Comment
const deleteComment =
  async (
    req,
    res
  ) => {
    try {
      const comment =
        await Comment.findById(
          req.params.id
        );

      if (
        !comment
      ) {
        return res
          .status(404)
          .json({
            message:
              "Comment not found",
          });
      }

      const isOwner =
        comment.user.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role ===
        "Admin";

      if (
        !isOwner &&
        !isAdmin
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized to delete this comment",
          });
      }

      if (
        comment.attachments &&
        comment.attachments
          .length > 0
      ) {
        for (
          const file of comment.attachments
        ) {
          try {
            await cloudinary.uploader.destroy(
              file.publicId,
              {
                resource_type:
                  "auto",
              }
            );
          } catch (
            error
          ) {
            console.error(
              error
            );
          }
        }
      }

      const deletedCommentId =
        comment._id;

      await comment.deleteOne();

      try {
        getIO().emit(
          "commentDeleted",
          {
            commentId:
              deletedCommentId,
          }
        );
      } catch (
        err
      ) {
        console.error(
          "Socket Emit Error:",
          err.message
        );
      }

      res.json({
        message:
          "Comment deleted successfully",
      });
    } catch (
      error
    ) {
      res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

module.exports = {
  createComment,
  getCommentsByTask,
  deleteComment,
};