const Notification = require("../models/Notification");

// Get Notifications
const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark One Read
const markAsRead = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!notification) {
      return res
        .status(404)
        .json({
          message:
            "Notification not found",
        });
    }

    notification.isRead = true;

    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

// Mark All Read
const markAllAsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.user._id,
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};