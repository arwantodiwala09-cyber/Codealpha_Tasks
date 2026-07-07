const express =
  require("express");

const router =
  express.Router();

const {
  getTaskActivity,
} = require(
  "../controllers/activityController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.get(
  "/:taskId",
  protect,
  getTaskActivity
);

module.exports =
  router;