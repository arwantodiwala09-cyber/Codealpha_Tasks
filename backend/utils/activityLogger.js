const TaskActivity =
  require(
    "../models/TaskActivity"
  );

const logActivity =
  async ({
    taskId,
    userId,
    action,
    description,
  }) => {
    try {
      await TaskActivity.create({
        task: taskId,
        user: userId,
        action,
        description,
      });
    } catch (error) {
      console.error(
        "Activity Log Error:",
        error.message
      );
    }
  };

module.exports =
  logActivity;