const User = require("../models/User");

// Get All Users (Admin Only)
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

// Update User Role (Admin Only)
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

module.exports = {
  getUsers,
  updateUserRole,
};