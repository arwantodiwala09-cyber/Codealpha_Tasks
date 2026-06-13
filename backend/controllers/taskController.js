const Task = require("../models/Task");
const Notification = require("../models/Notification");

// Create Task
const createTask = async (
  req,
  res
) => {
  try {
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Manager"
    ) {
      return res.status(403).json({
        message:
          "Only Managers and Admins can create tasks",
      });
    }

    const task =
      await Task.create({
        ...req.body,
        createdBy:
          req.user._id,
      });

    if (task.assignedTo) {
      await Notification.create({
        user: task.assignedTo,
        message: `You have been assigned a new task: ${task.title}`,
        type: "task_assigned",
      });
    }

    const populatedTask =
      await Task.findById(
        task._id
      ).populate(
        "assignedTo",
        "name email"
      );

    res
      .status(201)
      .json(
        populatedTask
      );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// Tasks Created By User
const getMyTasks = async (
  req,
  res
) => {
  try {
    const tasks =
      await Task.find({
        createdBy:
          req.user._id,
      })
        .populate(
          "assignedTo",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// Tasks Assigned To User
const getAssignedTasks =
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          assignedTo:
            req.user._id,
        })
          .populate(
            "assignedTo",
            "name email"
          )
          .sort({
            dueDate: 1,
          });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Due Today
const getDueTodayTasks =
  async (req, res) => {
    try {
      const start =
        new Date();

      start.setHours(
        0,
        0,
        0,
        0
      );

      const end =
        new Date();

      end.setHours(
        23,
        59,
        59,
        999
      );

      const tasks =
        await Task.find({
          assignedTo:
            req.user._id,
          dueDate: {
            $gte: start,
            $lte: end,
          },
          status: {
            $ne: "done",
          },
        }).populate(
          "assignedTo",
          "name email"
        );

      res.json(tasks);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Overdue
const getOverdueTasks =
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          assignedTo:
            req.user._id,
          dueDate: {
            $lt: new Date(),
          },
          status: {
            $ne: "done",
          },
        }).populate(
          "assignedTo",
          "name email"
        );

      res.json(tasks);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Tasks By Project
const getTasksByProject =
  async (req, res) => {
    try {
      const tasks =
        await Task.find({
          project:
            req.params
              .projectId,
        })
          .populate(
            "assignedTo",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Update Task
const updateTask =
  async (req, res) => {
    try {
      if (
        req.user.role !==
          "Admin" &&
        req.user.role !==
          "Manager"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Only Managers and Admins can update tasks",
          });
      }

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task Not Found",
          });
      }

      const previousStatus =
        task.status;

      Object.assign(
        task,
        req.body
      );

      await task.save();

      if (
        previousStatus !==
          "done" &&
        task.status ===
          "done" &&
        task.assignedTo
      ) {
        await Notification.create({
          user:
            task.assignedTo,
          message: `Task completed: ${task.title}`,
          type: "task_completed",
        });
      }

      const updatedTask =
        await Task.findById(
          task._id
        ).populate(
          "assignedTo",
          "name email"
        );

      res.json(
        updatedTask
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Delete Task
const deleteTask =
  async (req, res) => {
    try {
      if (
        req.user.role !==
          "Admin" &&
        req.user.role !==
          "Manager"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Only Managers and Admins can delete tasks",
          });
      }

      const task =
        await Task.findById(
          req.params.id
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task Not Found",
          });
      }

      await task.deleteOne();

      res.json({
        message:
          "Task Deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  createTask,
  getMyTasks,
  getAssignedTasks,
  getDueTodayTasks,
  getOverdueTasks,
  getTasksByProject,
  updateTask,
  deleteTask,
};