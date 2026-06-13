const express = require("express");

const {
  getAllUsers,
  updateUserRole,
} = require(
  "../controllers/teamController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

router.get(
  "/users",
  protect,
  getAllUsers
);

router.put(
  "/users/:id/role",
  protect,
  updateUserRole
);

module.exports = router;