const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC INFO
    // ======================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: [
        "Admin",
        "Manager",
        "Member",
      ],
      default: "Member",
    },

    // ======================
    // PROFILE
    // ======================

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "English",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    // ======================
    // USER PREFERENCES
    // ======================

    preferences: {
      darkMode: {
        type: Boolean,
        default: true,
      },

      emailNotifications: {
        type: Boolean,
        default: true,
      },

      pushNotifications: {
        type: Boolean,
        default: true,
      },

      taskReminder: {
        type: Boolean,
        default: true,
      },

      calendarSync: {
        type: Boolean,
        default: false,
      },

      accentColor: {
        type: String,
        default: "cyan",
      },
    },

    // ======================
    // ACCOUNT STATUS
    // ======================

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);