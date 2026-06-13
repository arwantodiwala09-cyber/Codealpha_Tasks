const User = require("../models/User");

// Get All Users
const getAllUsers = async (
  req,
  res
) => {
  try {
    const users =
      await User.find({})
        .select(
          "_id name email avatar role"
        )
        .sort({
          name: 1,
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
      if (
        req.user.role !==
        "Admin"
      ) {
        return res
          .status(403)
          .json({
            message:
              "Only Admin can update roles",
          });
      }

      const {
        role,
      } = req.body;

      if (
        ![
          "Admin",
          "Manager",
          "Member",
        ].includes(role)
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

module.exports = {
  getAllUsers,
  updateUserRole,
};