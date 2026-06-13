import {
  Calendar,
  Flag,
  Trash2,
  User,
} from "lucide-react";

import EditTaskModal from "./EditTaskModal";

export default function ProjectTaskCard({
  task,
  members,
  onDelete,
  onEdit,
  canDelete = false,
  canEdit = false,
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
    new Date(task.dueDate) <
      new Date() &&
    task.status !== "done";

  const handleDelete = () => {
    const confirmDelete =
      window.confirm(
        `Delete "${task.title}"?`
      );

    if (confirmDelete) {
      onDelete(task._id);
    }
  };

  return (
    <div
      className={`
        bg-slate-800
        border
        rounded-2xl
        p-4
        hover:border-cyan-500
        transition-all
        ${
          isOverdue
            ? "border-red-500"
            : "border-slate-700"
        }
      `}
    >
      <div className="flex justify-between items-start gap-3">
        <h4 className="font-semibold text-white">
          {task.title}
        </h4>

        <div className="flex items-center gap-3">
          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              ${priorityStyles[task.priority]}
            `}
          >
            {task.priority}
          </span>

          {canEdit && (
            <EditTaskModal
              task={task}
              members={members}
              onEdit={onEdit}
            />
          )}

          {canDelete && (
            <button
              onClick={handleDelete}
              className="
                text-red-400
                hover:text-red-300
                transition
              "
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mt-3">
          {task.description}
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Flag size={12} />
          Status: {task.status}
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={12} />
          {task.dueDate
            ? new Date(
                task.dueDate
              ).toLocaleDateString()
            : "No Due Date"}
        </div>

        <div className="flex items-center gap-2">
          <User size={12} />
          Assigned:{" "}
          {task.assignedTo?.name ||
            "Unassigned"}
        </div>

        {isOverdue && (
          <div className="text-red-400 font-medium">
            ⚠ Overdue Task
          </div>
        )}
      </div>
    </div>
  );
}