const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
  deleteProject,
} = require("../controllers/projectController");

const {
  protect,
  adminOnly,
  managerOrAdmin,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

// Create Project -> Admin / Manager
// View Projects -> All Logged Users
router
  .route("/")
  .post(
    protect,
    managerOrAdmin,
    createProject
  )
  .get(
    protect,
    getProjects
  );

// Add Member -> Admin / Manager
router.post(
  "/:id/add-member",
  protect,
  managerOrAdmin,
  addMemberToProject
);

// Remove Member -> Admin Only
router.delete(
  "/:id/members/:userId",
  protect,
  adminOnly,
  removeMemberFromProject
);

// Get Project -> All Logged Users
// Delete Project -> Admin Only
router
  .route("/:id")
  .get(
    protect,
    getProjectById
  )
  .delete(
    protect,
    adminOnly,
    deleteProject
  );

module.exports =
  router;