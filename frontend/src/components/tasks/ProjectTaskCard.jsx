import {
  Trash2,
  User,
  MessageSquare,
  History,
} from "lucide-react";

import TimerButton from "../time/TimerButton";

export default function ProjectTaskCard({
  task,
  members,
  onEdit,
  onDelete,
  onComment,
  onActivity,
  canEdit,
  canDelete,
}) {
  const priorityStyles = {
    High:
      "bg-red-500/10 text-red-400 border border-red-500/20",

    Medium:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

    Low:
      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${task.title}"?`
      )
    ) {
      onDelete(task._id);
    }
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-slate-900
        border
        rounded-3xl
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-cyan-500/10
        ${
          isOverdue
            ? "border-red-500/60"
            : "border-slate-800 hover:border-cyan-500/40"
        }
      `}
    >
      <div
        className={`
          absolute
          top-0
          left-0
          w-full
          h-1
          ${
            task.priority === "High"
              ? "bg-red-500"
              : task.priority === "Medium"
              ? "bg-yellow-500"
              : "bg-cyan-500"
          }
        `}
      />
            <div className="flex justify-between items-start gap-4">

        <div className="flex items-start gap-4 flex-1">

          <div
            className="
              h-12
              w-12
              rounded-full
              bg-gradient-to-br
              from-cyan-500
              to-blue-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shrink-0
            "
          >
            {task.assignedTo?.name
              ? task.assignedTo.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          <div className="flex-1 min-w-0">

            <h4
              className="
                text-white
                font-bold
                text-lg
                leading-tight
                truncate
              "
            >
              {task.title}
            </h4>

            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              Assigned to{" "}
              <span className="text-cyan-400 font-medium">
                {task.assignedTo?.name ||
                  "Unassigned"}
              </span>
            </p>

            {task.description && (
              <p
                className="
                  mt-3
                  text-sm
                  text-slate-400
                  leading-6
                  line-clamp-2
                "
              >
                {task.description}
              </p>
            )}

          </div>

        </div>

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            ${priorityStyles[task.priority]}
          `}
        >
          {task.priority}
        </span>

      </div>

      <div className="mt-5 pt-5 border-t border-slate-800">

        <div className="flex flex-wrap gap-2 mb-4">

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-semibold
              ${
                task.status === "done"
                  ? "bg-green-500/10 text-green-400"
                  : task.status === "progress"
                  ? "bg-cyan-500/10 text-cyan-400"
                  : task.status === "review"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-slate-700 text-slate-300"
              }
            `}
          >
            {task.status.charAt(0).toUpperCase() +
              task.status.slice(1)}
          </span>

          {task.dueDate && (
            <span
              className={`
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                ${
                  isOverdue
                    ? "bg-red-500/10 text-red-400"
                    : "bg-slate-700 text-slate-300"
                }
              `}
            >
              📅{" "}
              {new Date(
                task.dueDate
              ).toLocaleDateString()}
            </span>
          )}

        </div>
                <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <User
              size={14}
              className="text-cyan-400"
            />

            <span className="text-xs text-slate-400">
              {task.assignedTo?.name ||
                "Unassigned"}
            </span>

          </div>

          {isOverdue && (
            <div
              className="
                px-3
                py-1
                rounded-full
                bg-red-500/10
                text-red-400
                text-xs
                font-semibold
              "
            >
              ⚠ Overdue
            </div>
          )}

        </div>

      </div>

      <div className="mt-5 pt-4 border-t border-slate-700">

        <div className="flex justify-between items-center gap-4 flex-wrap">

          <TimerButton taskId={task._id} />

          <div className="flex items-center gap-2">

            <button
              onClick={() => onComment(task)}
              className="
                h-10
                w-10
                rounded-xl
                bg-slate-800
                text-cyan-400
                hover:bg-slate-700
                transition-all
                flex
                items-center
                justify-center
              "
            >
              <MessageSquare size={17} />
            </button>

            <button
              onClick={() => onActivity(task)}
              className="
                h-10
                w-10
                rounded-xl
                bg-slate-800
                text-slate-300
                hover:bg-slate-700
                transition-all
                flex
                items-center
                justify-center
              "
            >
              <History size={17} />
            </button>

            {canEdit && (
              <button
                onClick={() => onEdit(task)}
                className="
                  h-10
                  px-4
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-400
                  hover:bg-cyan-500/20
                  transition-all
                  text-sm
                  font-medium
                "
              >
                Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                className="
                  h-10
                  w-10
                  rounded-xl
                  bg-red-500/10
                  text-red-400
                  hover:bg-red-500/20
                  transition-all
                  flex
                  items-center
                  justify-center
                "
              >
                <Trash2 size={17} />
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}