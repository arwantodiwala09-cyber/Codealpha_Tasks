const Task = require("../models/Task");
const Project = require("../models/Project");
const TimeLog = require("../models/TimeLog");

// ===============================
// Project Summary Report
// ===============================
const getProjectReport = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .populate("members", "name email");

    const report = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          project: project._id,
        });

        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: "done",
        });

        const progress =
          totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
              );

        return {
          project: project.name,
          owner: project.owner?.name,
          members: project.members.length,
          totalTasks,
          completedTasks,
          progress,
        };
      })
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Task Report
// ===============================
const getTaskReport = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name")
      .populate("project", "name")
      .sort({
        createdAt: -1,
      });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Time Tracking Report
// ===============================
const getTimeReport = async (req, res) => {
  try {
    const logs = await TimeLog.find({
      isRunning: false,
    })
      .populate("user", "name")
      .populate("task", "title");

    const report = logs.map((log) => ({
      user: log.user?.name,
      task: log.task?.title,
      hours: (log.duration / 3600).toFixed(2),
      startTime: log.startTime,
      endTime: log.endTime,
    }));

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Productivity Report
// ===============================
const getProductivityReport = async (
  req,
  res
) => {
  try {
    const users = {};

    const tasks = await Task.find()
      .populate("assignedTo", "name");

    tasks.forEach((task) => {
      if (!task.assignedTo) return;

      const name =
        task.assignedTo.name;

      if (!users[name]) {
        users[name] = {
          user: name,
          total: 0,
          completed: 0,
        };
      }

      users[name].total++;

      if (task.status === "done") {
        users[name].completed++;
      }
    });

    const report = Object.values(users).map(
      (user) => ({
        ...user,
        productivity:
          user.total === 0
            ? 0
            : Math.round(
                (user.completed /
                  user.total) *
                  100
              ),
      })
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProjectReport,
  getTaskReport,
  getTimeReport,
  getProductivityReport,
};