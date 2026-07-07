const TimeLog = require("../models/TimeLog");
const Task = require("../models/Task");

// ===============================
// Start Timer
// ===============================
const startTimer = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const runningTimer = await TimeLog.findOne({
      user: req.user._id,
      isRunning: true,
    });

    if (runningTimer) {
      return res.status(400).json({
        message: "A timer is already running",
      });
    }

    const timeLog = await TimeLog.create({
      task: taskId,
      user: req.user._id,
      startTime: new Date(),
      isRunning: true,
    });

    const populatedLog = await TimeLog.findById(timeLog._id)
      .populate("task", "title")
      .populate("user", "name email");

    res.status(201).json(populatedLog);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Stop Timer
// ===============================
const stopTimer = async (req, res) => {
  try {
    const runningTimer = await TimeLog.findOne({
      user: req.user._id,
      isRunning: true,
    });

    if (!runningTimer) {
      return res.status(404).json({
        message: "No running timer found",
      });
    }

    runningTimer.endTime = new Date();

    runningTimer.duration = Math.floor(
      (runningTimer.endTime - runningTimer.startTime) / 1000
    );

    runningTimer.isRunning = false;

    await runningTimer.save();

    const populatedLog = await TimeLog.findById(runningTimer._id)
      .populate("task", "title")
      .populate("user", "name email");

    res.json(populatedLog);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get My Time Logs
// ===============================
const getMyLogs = async (req, res) => {
  try {
    const logs = await TimeLog.find({
      user: req.user._id,
    })
      .populate("task", "title")
      .sort({
        createdAt: -1,
      });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get Task Logs
// ===============================
const getTaskLogs = async (req, res) => {
  try {
    const logs = await TimeLog.find({
      task: req.params.taskId,
    })
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Time Statistics
// ===============================
const getTimeStats = async (req, res) => {
  try {
    const logs = await TimeLog.find({
      user: req.user._id,
      isRunning: false,
    });

    const totalSeconds = logs.reduce(
      (sum, log) => sum + log.duration,
      0
    );

    const totalHours = (totalSeconds / 3600).toFixed(2);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayLogs = logs.filter(
      (log) => log.createdAt >= today
    );

    const todaySeconds = todayLogs.reduce(
      (sum, log) => sum + log.duration,
      0
    );

    res.json({
      totalSeconds,
      totalHours,
      todaySeconds,
      todayHours: (todaySeconds / 3600).toFixed(2),
      sessions: logs.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  startTimer,
  stopTimer,
  getMyLogs,
  getTaskLogs,
  getTimeStats,
};