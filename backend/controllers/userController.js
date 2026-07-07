const User =
  require("../models/User");

const Project =
  require("../models/Project");

const Task =
  require("../models/Task");

const Notification =
  require("../models/Notification");

// Get All Users
const getUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find({})
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// Update User Role
const updateUserRole =
  async (req, res) => {
    try {
      const { role } =
        req.body;

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      user.role = role;

      await user.save();

      res.json({
        message:
          "Role updated successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Get User Profile
const getUserProfile =
  async (req, res) => {
    try {
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
              "User not found",
          });
      }

      const projects =
        await Project.find({
          members:
            user._id,
        })
          .populate(
            "owner",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      const tasks =
        await Task.find({
          assignedTo:
            user._id,
        })
          .populate(
            "project",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      const activities =
        await Notification.find({
          user:
            user._id,
        })
          .sort({
            createdAt: -1,
          })
          .limit(15);

      const completedTasks =
        tasks.filter(
          (task) =>
            task.status ===
            "done"
        ).length;

      const completionRate =
        tasks.length === 0
          ? 0
          : Math.round(
              (completedTasks /
                tasks.length) *
                100
            );

      const stats = {
        totalProjects:
          projects.length,

        totalTasks:
          tasks.length,

        completedTasks,

        completionRate,
      };

      res.json({
        user,
        stats,
        projects,
        tasks,
        activities,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getUsers,
  updateUserRole,
  getUserProfile,
};