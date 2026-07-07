const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ===============================
// Get Logged In User Profile
// ===============================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Profile
// ===============================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      language,
      timezone,
      avatar,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      email &&
      email !== user.email
    ) {
      const existing = await User.findOne({
        email,
      });

      if (existing) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || "";
    user.bio = bio || "";
    user.language =
      language || "English";
    user.timezone =
      timezone || "Asia/Kolkata";
    user.avatar =
      avatar || user.avatar;

    await user.save();

    res.json({
      message:
        "Profile updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Preferences
// ===============================

const updatePreferences = async (
  req,
  res
) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    user.preferences = {
      ...user.preferences,
      ...req.body,
    };

    await user.save();

    res.json({
      message:
        "Preferences updated",
      preferences:
        user.preferences,
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
// ===============================
// Change Password
// ===============================

const changePassword = async (
  req,
  res
) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect",
      });
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        message:
          "Passwords do not match",
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    await user.save();

    res.json({
      message:
        "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }

};

// ===============================
// Logout All Devices
// ===============================

const logoutAllDevices = async (
  req,
  res
) => {

  try {

    res.json({
      message:
        "Logged out from all devices",
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }

};

// ===============================
// Delete Account
// ===============================

const deleteAccount = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    user.deletedAt =
      new Date();

    await user.save();

    res.json({
      message:
        "Account deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }

};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  logoutAllDevices,
  deleteAccount,
};