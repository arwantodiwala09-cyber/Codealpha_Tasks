const TaskActivity =
  require(
    "../models/TaskActivity"
  );

const getTaskActivity =
  async (req, res) => {
    try {
      const activity =
        await TaskActivity.find({
          task:
            req.params
              .taskId,
        })
          .populate(
            "user",
            "name"
          )
          .sort({
            createdAt:
              -1,
          });

      res.json(
        activity
      );
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };

module.exports = {
  getTaskActivity,
};