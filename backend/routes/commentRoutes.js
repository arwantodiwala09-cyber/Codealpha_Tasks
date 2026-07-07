const express =
  require("express");

const router =
  express.Router();

const {
  createComment,
  getCommentsByTask,
  deleteComment,
} = require(
  "../controllers/commentController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

// Create Comment
router.post(
  "/",
  protect,
  upload.array(
    "attachments",
    5
  ),
  createComment
);

// Get Comments For Task
router.get(
  "/task/:taskId",
  protect,
  getCommentsByTask
);

// Delete Comment
router.delete(
  "/:id",
  protect,
  deleteComment
);

module.exports =
  router;