export default function UpcomingDeadlines({ tasks }) {
  const today = new Date();

  const upcomingTasks = tasks
    .filter((task) => task.dueDate)
    .sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    )
    .slice(0, 8);

  const getStatus = (dueDate) => {
    const due = new Date(dueDate);

    const diff = Math.ceil(
      (due - today) /
        (1000 * 60 * 60 * 24)
    );

    if (diff < 0)
      return {
        label: "Overdue",
        color: "text-red-400",
      };

    if (diff === 0)
      return {
        label: "Today",
        color: "text-yellow-400",
      };

    if (diff === 1)
      return {
        label: "Tomorrow",
        color: "text-cyan-400",
      };

    return {
      label: `${diff} days`,
      color: "text-green-400",
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-6">
        Upcoming Deadlines
      </h2>

      <div className="space-y-4">
        {upcomingTasks.length === 0 ? (
          <p className="text-slate-500">
            No upcoming tasks.
          </p>
        ) : (
          upcomingTasks.map((task) => {
            const status = getStatus(task.dueDate);

            return (
              <div
                key={task._id}
                className="bg-slate-800 rounded-2xl p-4 border border-slate-700"
              >
                <h3 className="font-semibold">
                  {task.title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {task.project?.name || "No Project"}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-slate-500">
                    {new Date(
                      task.dueDate
                    ).toLocaleDateString()}
                  </span>

                  <span
                    className={`text-xs font-semibold ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}