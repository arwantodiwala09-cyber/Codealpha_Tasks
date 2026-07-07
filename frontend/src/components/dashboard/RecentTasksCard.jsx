import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  CalendarDays,
  User,
} from "lucide-react";

import Card from "../ui/Card";

const statusStyles = {
  done: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    accent: "bg-green-500",
    icon: CheckCircle2,
  },
  progress: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    accent: "bg-cyan-500",
    icon: Clock3,
  },
  review: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    accent: "bg-yellow-500",
    icon: Clock3,
  },
  todo: {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    accent: "bg-slate-500",
    icon: Clock3,
  },
};

export default function RecentTasksCard({
  tasks = [],
}) {
  return (
    <Card
      className="
        relative
        overflow-hidden
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        via-slate-900
        to-slate-950
        transition-all
        duration-300
        hover:border-yellow-500/40
        hover:shadow-2xl
        hover:shadow-yellow-500/10
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-12
          -top-12
          h-44
          w-44
          rounded-full
          bg-yellow-500/10
          blur-3xl
        "
      />

      {/* Header */}

      <div className="relative flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">

          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-yellow-500/10
              flex
              items-center
              justify-center
            "
          >
            <ClipboardList
              size={22}
              className="text-yellow-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold">
              Recent Tasks
            </h2>

            <p className="text-sm text-slate-400">
              Recently assigned and updated tasks
            </p>

          </div>

        </div>

        <button
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-yellow-400
            hover:text-yellow-300
            transition
          "
        >
          View All

          <ArrowRight size={15} />

        </button>

      </div>

      {tasks.length === 0 ? (

        <div
          className="
            h-60
            rounded-3xl
            border-2
            border-dashed
            border-slate-700
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <ClipboardList
            size={42}
            className="text-slate-600 mb-4"
          />

          <p className="text-slate-500">
            No recent tasks
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {tasks
            .slice(0, 4)
            .map((task) => {

              const status =
                statusStyles[task.status] || {
                  bg: "bg-red-500/10",
                  text: "text-red-400",
                  border: "border-red-500/20",
                  accent: "bg-red-500",
                  icon: AlertTriangle,
                };

              const StatusIcon = status.icon;

              const overdue =
                task.dueDate &&
                new Date(task.dueDate) <
                  new Date() &&
                task.status !== "done";

              return (

                <div
                  key={task._id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/60
                    p-5
                    transition-all
                    duration-300
                    hover:border-yellow-500/40
                    hover:bg-slate-900
                    hover:-translate-y-1
                  "
                >

                  <div
                    className={`
                      absolute
                      left-0
                      top-0
                      bottom-0
                      w-1
                      ${status.accent}
                      scale-y-0
                      origin-top
                      transition-transform
                      duration-300
                      group-hover:scale-y-100
                    `}
                  />

                  <div className="flex justify-between gap-5">

                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-bold truncate">
                        {task.title}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm">

                        <div className="flex items-center gap-2 text-slate-400">

                          <User
                            size={14}
                            className="text-cyan-400"
                          />

                          {task.assignedTo?.name ||
                            "Unassigned"}

                        </div>

                        {task.project?.name && (

                          <div className="flex items-center gap-2 text-slate-400">

                            <ClipboardList
                              size={14}
                              className="text-purple-400"
                            />

                            {task.project.name}

                          </div>

                        )}

                      </div>

                      {task.dueDate && (

                        <div
                          className={`
                            mt-4
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${
                              overdue
                                ? "bg-red-500/10 text-red-400"
                                : "bg-slate-800 text-slate-400"
                            }
                          `}
                        >
                          <CalendarDays size={13} />

                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}

                        </div>

                      )}

                    </div>

                    <div
                      className={`
                        inline-flex
                        h-fit
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        ${status.bg}
                        ${status.text}
                        ${status.border}
                      `}
                    >
                      <StatusIcon size={14} />

                      {task.status}

                    </div>

                  </div>

                </div>

              );

            })}

        </div>

      )}

    </Card>
  );
}