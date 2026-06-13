import {
  Circle,
  Loader2,
  Eye,
  CheckCircle2,
} from "lucide-react";

import TaskCard from "./TaskCard";

function Column({
  title,
  icon,
  color,
  tasks,
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        flex
        flex-col
        min-h-162.5
        shadow-xl
        shadow-cyan-500/5
      "
    >
      <div
        className="
          p-5
          border-b
          border-slate-800
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">
          <div className={color}>
            {icon}
          </div>

          <h3
            className="
              text-lg
              font-extrabold
              tracking-tight
            "
          >
            {title}
          </h3>
        </div>

        <span
          className="
            bg-slate-800
            text-slate-400
            text-sm
            px-3
            py-1
            rounded-full
          "
        >
          {tasks.length}
        </span>
      </div>

      <div className="p-4 flex-1 space-y-4">
        {tasks.length === 0 ? (
          <div
            className="
              h-40
              border-2
              border-dashed
              border-slate-700
              rounded-2xl
              flex
              items-center
              justify-center
              text-slate-500
            "
          >
            No Tasks
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              priority={task.priority}
              assignee={
                task.assignedTo
                  ?.name ||
                "Unassigned"
              }
              dueDate={
                task.dueDate
                  ? new Date(
                    task.dueDate
                  ).toLocaleDateString()
                  : "No Date"
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function Board({
  tasks = [],
}) {
  return (
    <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
      <Column
        title="To Do"
        icon={<Circle size={18} />}
        color="text-slate-400"
        tasks={tasks.filter(
          (task) =>
            task.status ===
            "todo"
        )}
      />

      <Column
        title="In Progress"
        icon={<Loader2 size={18} />}
        color="text-cyan-400"
        tasks={tasks.filter(
          (task) =>
            task.status ===
            "progress"
        )}
      />

      <Column
        title="Review"
        icon={<Eye size={18} />}
        color="text-yellow-400"
        tasks={tasks.filter(
          (task) =>
            task.status ===
            "review"
        )}
      />

      <Column
        title="Done"
        icon={
          <CheckCircle2 size={18} />
        }
        color="text-green-400"
        tasks={tasks.filter(
          (task) =>
            task.status ===
            "done"
        )}
      />
    </div>
  );
}