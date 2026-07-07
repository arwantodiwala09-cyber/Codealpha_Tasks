const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  logoutAllDevices,
  deleteAccount,
} = require("../controllers/settingsController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ===========================
// Profile
// ===========================

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

// ===========================
// Preferences
// ===========================

router.put(
  "/preferences",
  protect,
  updatePreferences
);

// ===========================
// Password
// ===========================

router.put(
  "/password",
  protect,
  changePassword
);

// ===========================
// Logout All Devices
// ===========================

router.post(
  "/logout-all",
  protect,
  logoutAllDevices
);

// ===========================
// Delete Account
// ===========================

router.delete(
  "/delete-account",
  protect,
  deleteAccount
);

module.exports = router;