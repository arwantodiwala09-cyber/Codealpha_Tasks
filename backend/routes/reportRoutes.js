const express = require("express");

const {
  getProjectReport,
  getTaskReport,
  getTimeReport,
  getProductivityReport,
} = require("../controllers/reportController");

const {
  protect,
  managerOrAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Project Summary Report
router.get(
  "/projects",
  protect,
  managerOrAdmin,
  getProjectReport
);

// Task Report
router.get(
  "/tasks",
  protect,
  managerOrAdmin,
  getTaskReport
);

// Time Tracking Report
router.get(
  "/time",
  protect,
  managerOrAdmin,
  getTimeReport
);

// Productivity Report
router.get(
  "/productivity",
  protect,
  managerOrAdmin,
  getProductivityReport
);

module.exports = router;