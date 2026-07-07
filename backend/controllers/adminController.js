const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

// =======================================
// Get Dashboard Statistics
// =======================================
const getAdminStats = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message:
          "Access Denied",
      });
    }

    const [
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      activeProjects,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({
        status: "done",
      }),
      Project.countDocuments({
        status: "Active",
      }),
    ]);

    const pendingTasks =
      totalTasks -
      completedTasks;

    res.json({
      totalUsers,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      activeProjects,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// =======================================
// Get All Users
// =======================================
const getUsers =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Access Denied",
          });
      }

      const users =
        await User.find()
          .select(
            "-password"
          )
          .sort({
            createdAt:
              -1,
          });

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =======================================
// Search Users
// =======================================
const searchUsers =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Access Denied",
          });
      }

      const keyword =
        req.query.keyword
          ? {
              $or: [
                {
                  name: {
                    $regex:
                      req.query
                        .keyword,
                    $options:
                      "i",
                  },
                },
                {
                  email: {
                    $regex:
                      req.query
                        .keyword,
                    $options:
                      "i",
                  },
                },
              ],
            }
          : {};

      const users =
        await User.find(
          keyword
        )
          .select(
            "-password"
          )
          .sort({
            createdAt:
              -1,
          });

      res.json(users);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =======================================
// Get User By ID
// =======================================
const getUserById =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Access Denied",
          });
      }

      const user =
        await User.findById(
          req.params.id
        ).select(
          "-password"
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };
  // =======================================
// Update User Role
// =======================================
const updateUserRole =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Access Denied",
          });
      }

      const { role } =
        req.body;

      const allowedRoles = [
        "Admin",
        "Manager",
        "Member",
      ];

      if (
        !allowedRoles.includes(
          role
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid role",
          });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      user.role = role;

      await user.save();

      res.json({
        message:
          "Role Updated Successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =======================================
// Block / Unblock User
// =======================================
const toggleUserStatus =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Access Denied",
          });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      user.isBlocked =
        !user.isBlocked;

      await user.save();

      res.json({
        message:
          user.isBlocked
            ? "User Blocked"
            : "User Unblocked",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// =======================================
// Delete User
// =======================================
const deleteUser =
  async (req, res) => {
    try {
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Access Denied",
          });
      }

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User Not Found",
          });
      }

      if (
        user._id.toString() ===
        req.user._id.toString()
      ) {
        return res
          .status(400)
          .json({
            message:
              "You cannot delete your own account",
          });
      }

      await user.deleteOne();

      res.json({
        message:
          "User Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getAdminStats,
  getUsers,
  searchUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
};