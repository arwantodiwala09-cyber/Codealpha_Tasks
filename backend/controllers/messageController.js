const Message =
  require("../models/Message");

const Project =
  require("../models/Project");

const User =
  require("../models/User");

const Notification =
  require("../models/Notification");

const {
  getIO,
} = require(
  "../socket/socket"
);

// Get Project Messages
const getMessages =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.projectId
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      const messages =
        await Message.find({
          project:
            req.params.projectId,
        })
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "mentions",
            "name email"
          )
          .populate(
            "reactions.user",
            "name email"
          )
          .sort({
            createdAt: 1,
          });

      res.json(messages);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Send Message
const sendMessage =
  async (req, res) => {
    try {
      const {
        text,
      } = req.body;

      if (
        !text ||
        !text.trim()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Message text is required",
          });
      }

      const project =
        await Project.findById(
          req.params.projectId
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project not found",
          });
      }

      const mentionRegex =
        /@([a-zA-Z0-9_]+)/g;

      const mentionNames =
        [];

      let match;

      while (
        (
          match =
            mentionRegex.exec(
              text
            )
        ) !== null
      ) {
        mentionNames.push(
          match[1]
        );
      }

      let mentionedUsers =
        [];

      if (
        mentionNames.length >
        0
      ) {
        mentionedUsers =
          await User.find({
            name: {
              $in:
                mentionNames,
            },
          });
      }

      const message =
        await Message.create({
          project:
            req.params.projectId,
          sender:
            req.user._id,
          text,
          mentions:
            mentionedUsers.map(
              (
                user
              ) =>
                user._id
            ),
          reactions: [],
        });

      const populatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "mentions",
            "name email"
          )
          .populate(
            "reactions.user",
            "name email"
          );

      for (const user of mentionedUsers) {
        if (
          user._id.toString() !==
          req.user._id.toString()
        ) {
          const notification =
            await Notification.create(
              {
                user:
                  user._id,
                message: `${req.user.name} mentioned you in project chat`,
                type:
                  "task_comment",
              }
            );

          getIO().emit(
            "newNotification",
            notification
          );
        }
      }

      getIO()
        .to(
          req.params.projectId
        )
        .emit(
          "newMessage",
          populatedMessage
        );

      res
        .status(201)
        .json(
          populatedMessage
        );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Add Reaction
const addReaction =
  async (req, res) => {
    try {
      const {
        emoji,
      } = req.body;

      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      const existingReaction =
        message.reactions.find(
          (
            reaction
          ) =>
            reaction.user.toString() ===
              req.user._id.toString() &&
            reaction.emoji ===
              emoji
        );

      if (
        existingReaction
      ) {
        message.reactions =
          message.reactions.filter(
            (
              reaction
            ) =>
              !(
                reaction.user.toString() ===
                  req.user._id.toString() &&
                reaction.emoji ===
                  emoji
              )
          );
      } else {
        message.reactions.push(
          {
            user:
              req.user._id,
            emoji,
          }
        );
      }

      await message.save();

      const updatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "mentions",
            "name email"
          )
          .populate(
            "reactions.user",
            "name email"
          );

      getIO()
        .to(
          message.project.toString()
        )
        .emit(
          "messageReactionUpdated",
          updatedMessage
        );

      res.json(
        updatedMessage
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Edit Message
const editMessage =
  async (req, res) => {
    try {
      const {
        text,
      } = req.body;

      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      if (
        message.sender.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not authorized",
          });
      }

      message.text =
        text;

      message.isEdited =
        true;

      message.editedAt =
        new Date();

      await message.save();

      const updatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "mentions",
            "name email"
          )
          .populate(
            "reactions.user",
            "name email"
          );

      getIO()
        .to(
          message.project.toString()
        )
        .emit(
          "messageEdited",
          updatedMessage
        );

      res.json(
        updatedMessage
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Delete Message
const deleteMessage =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      const isOwner =
        message.sender.toString() ===
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
              "Not authorized",
          });
      }

      message.text =
        "This message was deleted";

      message.isDeleted =
        true;

      message.deletedAt =
        new Date();

      await message.save();

      const updatedMessage =
        await Message.findById(
          message._id
        )
          .populate(
            "sender",
            "name email role"
          )
          .populate(
            "mentions",
            "name email"
          )
          .populate(
            "reactions.user",
            "name email"
          );

      getIO()
        .to(
          message.project.toString()
        )
        .emit(
          "messageDeleted",
          updatedMessage
        );

      res.json({
        message:
          "Message deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
// Mark Project Messages Seen
const markProjectMessagesSeen =
  async (req, res) => {
    try {
      const messages =
        await Message.find({
          project:
            req.params.projectId,
          sender: {
            $ne:
              req.user._id,
          },
        });

      for (const message of messages) {
        const alreadySeen =
          message.seenBy?.some(
            (entry) =>
              entry.user.toString() ===
              req.user._id.toString()
          );

        if (!alreadySeen) {
          message.seenBy.push({
            user:
              req.user._id,
            seenAt:
              new Date(),
          });

          await message.save();

          getIO()
            .to(
              message.project.toString()
            )
            .emit(
              "messageSeen",
              {
                messageId:
                  message._id,
                userId:
                  req.user._id,
              }
            );
        }
      }

      res.json({
        message:
          "Messages marked as seen",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Mark Single Message Seen
const markMessageSeen =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params.id
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      const alreadySeen =
        message.seenBy?.some(
          (entry) =>
            entry.user.toString() ===
            req.user._id.toString()
        );

      if (!alreadySeen) {
        message.seenBy.push({
          user:
            req.user._id,
          seenAt:
            new Date(),
        });

        await message.save();

        getIO()
          .to(
            message.project.toString()
          )
          .emit(
            "messageSeen",
            {
              messageId:
                message._id,
              userId:
                req.user._id,
            }
          );
      }

      res.json({
        message:
          "Seen updated",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
module.exports = {
  getMessages,
  sendMessage,
  addReaction,
  editMessage,
  deleteMessage,
  markProjectMessagesSeen,
  markMessageSeen,
};