const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  getMessages,
  sendMessage,
  addReaction,
  editMessage,
  deleteMessage,
  markProjectMessagesSeen,
  markMessageSeen,
} = require(
  "../controllers/messageController"
);

// Get Project Messages
router.get(
  "/:projectId",
  protect,
  getMessages
);

// Send Message
router.post(
  "/:projectId",
  protect,
  sendMessage
);

// Add / Remove Reaction
router.put(
  "/reaction/:id",
  protect,
  addReaction
);

// Edit Message
router.put(
  "/edit/:id",
  protect,
  editMessage
);

// Delete Message
router.delete(
  "/:id",
  protect,
  deleteMessage
);

// Mark Entire Project Seen
router.put(
  "/seen/project/:projectId",
  protect,
  markProjectMessagesSeen
);

// Mark Single Message Seen
router.put(
  "/seen/:id",
  protect,
  markMessageSeen
);

module.exports =
  router;