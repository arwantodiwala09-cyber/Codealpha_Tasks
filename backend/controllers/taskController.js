const Task = require("../models/Task");
const Notification = require("../models/Notification");
const TaskActivity = require("../models/TaskActivity");

const {
  getIO,
} = require("../socket/socket");

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

    await TaskActivity.create({
      task: task._id,

      user: req.user._id,

      action:
        "TASK_CREATED",

      description: `${req.user.name} created task "${task.title}"`,
    });

    if (task.assignedTo) {
      const notification =
        await Notification.create({
          user:
            task.assignedTo,
          message: `You have been assigned a new task: ${task.title}`,
          type:
            "task_assigned",
        });

      try {
        getIO().emit(
          "newNotification",
          notification
        );
      } catch (err) {
        console.error(
          "Notification Socket Error:",
          err.message
        );
      }
    }

    const populatedTask =
      await Task.findById(
        task._id
      ).populate(
        "assignedTo",
        "name email"
      );

    try {
      getIO().emit(
        "taskCreated",
        populatedTask
      );
    } catch (err) {
      console.error(
        "Socket Error:",
        err.message
      );
    }

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
            req.params.projectId,
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

// Calendar Tasks
const getTasks = async (
  req,
  res
) => {
  try {
    let query = {};

    // Admin & Manager can view all tasks
    if (
      req.user.role !==
        "Admin" &&
      req.user.role !==
        "Manager"
    ) {
      query = {
        $or: [
          {
            assignedTo:
              req.user._id,
          },
          {
            createdBy:
              req.user._id,
          },
        ],
      };
    }

    const tasks =
      await Task.find(query)
        .populate(
          "assignedTo",
          "name email"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          dueDate: 1,
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

      const previousAssigned =
        task.assignedTo
          ? task.assignedTo.toString()
          : null;

      Object.assign(
        task,
        req.body
      );

      await task.save();
            if (
        previousStatus !==
        task.status
      ) {
        await TaskActivity.create({
          task: task._id,

          user: req.user._id,

          action:
            "STATUS_CHANGED",

          description: `${req.user.name} changed status from ${previousStatus} to ${task.status}`,
        });
      }

      if (
        previousAssigned !==
        (task.assignedTo
          ? task.assignedTo.toString()
          : null)
      ) {
        await TaskActivity.create({
          task: task._id,

          user: req.user._id,

          action:
            "TASK_ASSIGNED",

          description: `${req.user.name} changed task assignment`,
        });
      }

      if (
        previousStatus !==
          "done" &&
        task.status ===
          "done" &&
        task.assignedTo
      ) {
        const notification =
          await Notification.create({
            user:
              task.assignedTo,
            message: `Task completed: ${task.title}`,
            type:
              "task_completed",
          });

        try {
          getIO().emit(
            "newNotification",
            notification
          );
        } catch (err) {
          console.error(
            "Notification Socket Error:",
            err.message
          );
        }
      }

      const updatedTask =
        await Task.findById(
          task._id
        ).populate(
          "assignedTo",
          "name email"
        );

      try {
        getIO().emit(
          "taskUpdated",
          updatedTask
        );
      } catch (err) {
        console.error(
          "Socket Error:",
          err.message
        );
      }

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

      const taskId =
        task._id;

      await TaskActivity.create({
        task: task._id,

        user: req.user._id,

        action:
          "TASK_DELETED",

        description: `${req.user.name} deleted task "${task.title}"`,
      });

      await task.deleteOne();
            try {
        getIO().emit(
          "taskDeleted",
          {
            taskId,
          }
        );
      } catch (err) {
        console.error(
          "Socket Error:",
          err.message
        );
      }

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
  getTasks,
  updateTask,
  deleteTask,
};