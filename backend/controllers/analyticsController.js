const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const getAnalytics = async (
  req,
  res
) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalTasks,

      totalManagers,
      totalMembers,
      totalAdmins,

      completedTasks,
      pendingTasks,
      overdueTasks,

      todoTasks,
      progressTasks,
      reviewTasks,
      doneTasks,

      recentUsers,
      recentProjects,
      recentTasks,
    ] = await Promise.all([
      User.countDocuments(),

      Project.countDocuments(),

      Task.countDocuments(),

      User.countDocuments({
        role: "Manager",
      }),

      User.countDocuments({
        role: "Member",
      }),

      User.countDocuments({
        role: "Admin",
      }),

      Task.countDocuments({
        status: "done",
      }),

      Task.countDocuments({
        status: {
          $ne: "done",
        },
      }),

      Task.countDocuments({
        dueDate: {
          $lt: new Date(),
        },
        status: {
          $ne: "done",
        },
      }),

      Task.countDocuments({
        status: "todo",
      }),

      Task.countDocuments({
        status: "progress",
      }),

      Task.countDocuments({
        status: "review",
      }),

      Task.countDocuments({
        status: "done",
      }),

      User.find({})
        .select(
          "name email role createdAt"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5),

      Project.find({})
        .populate(
          "owner",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5),

      Task.find({})
        .populate(
          "assignedTo",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5),
    ]);

    const taskStatusChart = [
      {
        name: "Todo",
        value: todoTasks,
      },
      {
        name: "In Progress",
        value: progressTasks,
      },
      {
        name: "Review",
        value: reviewTasks,
      },
      {
        name: "Done",
        value: doneTasks,
      },
    ];

    const roleDistribution = [
      {
        name: "Admins",
        value: totalAdmins,
      },
      {
        name: "Managers",
        value: totalManagers,
      },
      {
        name: "Members",
        value: totalMembers,
      },
    ];

    res.json({
      totalUsers,
      totalProjects,
      totalTasks,

      totalManagers,
      totalMembers,
      totalAdmins,

      completedTasks,
      pendingTasks,
      overdueTasks,

      recentUsers,
      recentProjects,
      recentTasks,

      taskStatusChart,
      roleDistribution,
    });
  } catch (error) {
    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};