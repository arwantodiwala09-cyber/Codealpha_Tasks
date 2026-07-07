const express = require("express");

const {
  startTimer,
  stopTimer,
  getMyLogs,
  getTaskLogs,
  getTimeStats,
} = require("../controllers/timeLogController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Start Timer
router.post(
  "/start",
  protect,
  startTimer
);

// Stop Timer
router.post(
  "/stop",
  protect,
  stopTimer
);

// Get My Time Logs
router.get(
  "/my",
  protect,
  getMyLogs
);

// Get Logs For Specific Task
router.get(
  "/task/:taskId",
  protect,
  getTaskLogs
);

// Get Time Statistics
router.get(
  "/stats",
  protect,
  getTimeStats
);

module.exports = router;