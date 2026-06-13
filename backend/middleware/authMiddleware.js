const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
const protect = async (
  req,
  res,
  next
) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({
            message:
              "User not found",
          });
      }

      next();
    } else {
      return res
        .status(401)
        .json({
          message:
            "Not Authorized",
        });
    }
  } catch (error) {
    res.status(401).json({
      message:
        "Token Failed",
    });
  }
};

// Admin Only
const adminOnly = (
  req,
  res,
  next
) => {
  if (
    req.user.role ===
    "Admin"
  ) {
    return next();
  }

  return res
    .status(403)
    .json({
      message:
        "Admin access required",
    });
};

// Admin OR Manager
const managerOrAdmin =
  (
    req,
    res,
    next
  ) => {
    if (
      req.user.role ===
        "Admin" ||
      req.user.role ===
        "Manager"
    ) {
      return next();
    }

    return res
      .status(403)
      .json({
        message:
          "Manager or Admin access required",
      });
  };

module.exports = {
  protect,
  adminOnly,
  managerOrAdmin,
};