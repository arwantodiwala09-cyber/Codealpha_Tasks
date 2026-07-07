const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

const {
  getIO,
} = require("../socket/socket");

// Create Project
const createProject = async (
  req,
  res
) => {
  try {
    const {
  name,
  description,
  template,
} = req.body;

    const project =
      await Project.create({
        name,
        description,
        template,
        owner: req.user._id,
        members: [
          req.user._id,
        ],
      });
let templateTasks = [];

switch (template) {
  case "Web Development":
    templateTasks = [
      "Requirement Analysis",
      "UI Design",
      "Frontend Development",
      "Backend Development",
      "Database Design",
      "API Integration",
      "Testing",
      "Deployment",
    ];
    break;

  case "Mobile App":
    templateTasks = [
      "Planning",
      "UI/UX",
      "Flutter / React Native",
      "Authentication",
      "Testing",
      "Play Store Upload",
    ];
    break;

  case "Research Project":
    templateTasks = [
      "Literature Survey",
      "Problem Statement",
      "Methodology",
      "Implementation",
      "Testing",
      "Paper Writing",
    ];
    break;

  case "Hackathon":
    templateTasks = [
      "Idea",
      "Planning",
      "UI",
      "Backend",
      "Presentation",
      "Final Demo",
    ];
    break;

  case "College Project":
    templateTasks = [
      "Proposal",
      "Design",
      "Development",
      "Documentation",
      "Testing",
      "Final Submission",
    ];
    break;

  default:
    templateTasks = [];
}

for (const title of templateTasks) {
  await Task.create({
    title,
    project: project._id,
    assignedTo: req.user._id,
  });
}
    const notification =
      await Notification.create({
        user:
          req.user._id,
        message: `Project created: ${project.name}`,
        type:
          "project_created",
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

    res.status(201).json(
      project
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// Get Projects
const getProjects = async (
  req,
  res
) => {
  try {
    let projects;

    if (
      req.user.role ===
      "Admin"
    ) {
      projects =
        await Project.find()
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          )
          .sort({
            createdAt: -1,
          });
    } else {
      projects =
        await Project.find({
          members:
            req.user._id,
        })
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          )
          .sort({
            createdAt: -1,
          });
    }

    const projectsWithProgress =
      await Promise.all(
        projects.map(
          async (project) => {
            const totalTasks =
              await Task.countDocuments(
                {
                  project:
                    project._id,
                }
              );

            const completedTasks =
              await Task.countDocuments(
                {
                  project:
                    project._id,
                  status:
                    "done",
                }
              );

            const progress =
              totalTasks === 0
                ? 0
                : Math.round(
                    (
                      completedTasks /
                      totalTasks
                    ) *
                      100
                  );

            return {
              ...project.toObject(),
              totalTasks,
              completedTasks,
              progress,
            };
          }
        )
      );

    res.json(
      projectsWithProgress
    );
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// Get Single Project
const getProjectById =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        )
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project Not Found",
          });
      }

      const totalTasks =
        await Task.countDocuments(
          {
            project:
              project._id,
          }
        );

      const completedTasks =
        await Task.countDocuments(
          {
            project:
              project._id,
            status:
              "done",
          }
        );

      const progress =
        totalTasks === 0
          ? 0
          : Math.round(
              (
                completedTasks /
                totalTasks
              ) *
                100
            );

      res.json({
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Add Member
const addMemberToProject =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project Not Found",
          });
      }

      if (
        project.owner.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Only owner can add members",
          });
      }

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found",
          });
      }

      const alreadyMember =
        project.members.some(
          (memberId) =>
            memberId.toString() ===
            user._id.toString()
        );

      if (
        alreadyMember
      ) {
        return res
          .status(400)
          .json({
            message:
              "User already in project",
          });
      }

      project.members.push(
        user._id
      );

      await project.save();

      const notification =
        await Notification.create({
          user:
            user._id,
          message: `You were added to project: ${project.name}`,
          type:
            "member_added",
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

      const updatedProject =
        await Project.findById(
          project._id
        )
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );

      res.json(
        updatedProject
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Remove Member
const removeMemberFromProject =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project Not Found",
          });
      }

      if (
        project.owner.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Only owner can remove members",
          });
      }

      const memberId =
        req.params.userId;

      if (
        project.owner.toString() ===
        memberId
      ) {
        return res
          .status(400)
          .json({
            message:
              "Project owner cannot be removed",
          });
      }

      const notification =
        await Notification.create({
          user:
            memberId,
          message: `You were removed from project: ${project.name}`,
          type:
            "member_removed",
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

      project.members =
        project.members.filter(
          (member) =>
            member.toString() !==
            memberId
        );

      await project.save();

      const updatedProject =
        await Project.findById(
          project._id
        )
          .populate(
            "owner",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );

      res.json(
        updatedProject
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// Delete Project
const deleteProject =
  async (req, res) => {
    try {
      const project =
        await Project.findById(
          req.params.id
        );

      if (!project) {
        return res
          .status(404)
          .json({
            message:
              "Project Not Found",
          });
      }

      if (
        project.owner.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Not Project Owner",
          });
      }

      await project.deleteOne();

      res.json({
        message:
          "Project Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
  deleteProject,
};