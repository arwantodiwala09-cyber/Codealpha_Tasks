const express = require("express");

const {
  getAdminStats,
  getUsers,
  searchUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

// ======================================
// Dashboard Statistics
// ======================================
router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);

// ======================================
// Get All Users
// ======================================
router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);

// ======================================
// Search Users
// ======================================
router.get(
  "/users/search",
  protect,
  adminOnly,
  searchUsers
);

// ======================================
// Get Single User
// ======================================
router.get(
  "/users/:id",
  protect,
  adminOnly,
  getUserById
);

// ======================================
// Update User Role
// ======================================
router.put(
  "/users/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

// ======================================
// Block / Unblock User
// ======================================
router.put(
  "/users/:id/status",
  protect,
  adminOnly,
  toggleUserStatus
);

// ======================================
// Delete User
// ======================================
router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

module.exports = router;