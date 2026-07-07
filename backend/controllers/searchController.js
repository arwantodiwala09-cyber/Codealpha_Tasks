const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const ProjectFile = require("../models/ProjectFile");
const Message = require("../models/Message");

const globalSearch = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.json({
        projects: [],
        tasks: [],
        users: [],
        files: [],
        messages: [],
      });
    }

    const regex = new RegExp(q, "i");

    const [
      projects,
      tasks,
      users,
      files,
      messages,
    ] = await Promise.all([
      Project.find({
        name: regex,
      }).limit(5),

      Task.find({
        title: regex,
      }).limit(5),

      User.find({
        name: regex,
      })
        .select("name email role")
        .limit(5),

      ProjectFile.find({
        originalName: regex,
      }).limit(5),

      Message.find({
        text: regex,
      })
        .populate(
          "sender",
          "name"
        )
        .limit(5),
    ]);

    res.json({
      projects,
      tasks,
      users,
      files,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  globalSearch,
};