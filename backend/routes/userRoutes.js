const express =
  require("express");

const router =
  express.Router();

const {
  getUsers,
  updateUserRole,
} = require(
  "../controllers/userController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

// Get All Users
router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);

// Update Role
router.put(
  "/:id/role",
  protect,
  adminOnly,
  updateUserRole
);

module.exports =
  router;