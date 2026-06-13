import {
  Calendar,
  User,
  Flag,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";

export default function TaskCard({
  title,
  priority,
  assignee,
  dueDate,
}) {
  const priorityStyles = {
    High: {
      badge:
        "bg-red-500/10 text-red-400 border border-red-500/20",
      dot: "bg-red-400",
    },

    Medium: {
      badge:
        "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
      dot: "bg-yellow-400",
    },

    Low: {
      badge:
        "bg-green-500/10 text-green-400 border border-green-500/20",
      dot: "bg-green-400",
    },
  };

  const isOverdue =
    dueDate &&
    dueDate !== "No Date" &&
    new Date(dueDate) <
      new Date();

  return (
    <div
      className={`
        bg-slate-800
        border
        rounded-2xl
        p-4
        hover:shadow-lg
        hover:shadow-cyan-500/5
        hover:-translate-y-1
        transition-all
        cursor-pointer
        ${
          isOverdue
            ? "border-red-500/50"
            : "border-slate-700 hover:border-cyan-500"
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h4
          className="
            font-bold
            text-white
            leading-6
            tracking-tight
          "
        >
          {title}
        </h4>

        <button
          className="
            text-slate-500
            hover:text-white
            transition
          "
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Priority */}
      <div className="mb-4">
        <span
          className={`
            inline-flex
            items-center
            gap-2
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            ${
              priorityStyles[
                priority
              ]?.badge
            }
          `}
        >
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${
                priorityStyles[
                  priority
                ]?.dot
              }
            `}
          />

          {priority} Priority
        </span>
      </div>

      {/* Overdue */}
      {isOverdue && (
        <div
          className="
            mb-4
            flex
            items-center
            gap-2
            text-red-400
            text-xs
            font-semibold
          "
        >
          <AlertTriangle
            size={14}
          />
          Overdue Task
        </div>
      )}

      {/* Footer */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <User size={14} />

          <span>
            {assignee ||
              "Unassigned"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={14} />

          <span>
            {dueDate ||
              "No Date"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <Flag size={14} />

          <span>
            {priority}
          </span>
        </div>
      </div>
    </div>
  );
}