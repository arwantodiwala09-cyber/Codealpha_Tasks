const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create Project
const createProject = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
    } = req.body;

    const project =
      await Project.create({
        name,
        description,
        owner: req.user._id,
        members: [
          req.user._id,
        ],
      });

    // Notification
    await Notification.create({
      user: req.user._id,
      message: `Project created: ${project.name}`,
      type: "project_created",
    });

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

// Get User Projects
const getProjects = async (
  req,
  res
) => {
  try {
    const projects =
      await Project.find({
        members:
          req.user._id,
      })
        .populate(
          "owner",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json(projects);
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

      res.json(project);
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

      // Notification
      await Notification.create({
        user: user._id,
        message: `You were added to project: ${project.name}`,
        type: "member_added",
      });

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

      // Notification
      await Notification.create({
        user: memberId,
        message: `You were removed from project: ${project.name}`,
        type: "member_removed",
      });

      project.members =
        project.members.filter(
          (
            member
          ) =>
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