const express = require("express");

const {
  createTask,
  getMyTasks,
  getAssignedTasks,
  getDueTodayTasks,
  getOverdueTasks,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require(
  "../controllers/taskController"
);

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

// View Tasks
router.get(
  "/",
  protect,
  getMyTasks
);

router.get(
  "/assigned",
  protect,
  getAssignedTasks
);

router.get(
  "/due-today",
  protect,
  getDueTodayTasks
);

router.get(
  "/overdue",
  protect,
  getOverdueTasks
);

router.get(
  "/project/:projectId",
  protect,
  getTasksByProject
);

// Create Task
router.post(
  "/",
  protect,
  managerOrAdmin,
  createTask
);

// Update Task
router.put(
  "/:id",
  protect,
  managerOrAdmin,
  updateTask
);

// Delete Task
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteTask
);

module.exports = router;