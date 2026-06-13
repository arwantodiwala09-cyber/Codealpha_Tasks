import {
  FolderKanban,
  Users,
  CalendarDays,
  MoreVertical,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function ProjectCard({
  project,
}) {
  const navigate =
    useNavigate();

  const createdDate =
    project.createdAt
      ? new Date(
          project.createdAt
        ).toLocaleDateString()
      : "Recently";

  return (
    <div
      onClick={() =>
        navigate(
          `/projects/${project._id}`
        )
      }
      className="
        group
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
        shadow-xl
        shadow-cyan-500/5
        hover:border-cyan-500/40
        hover:shadow-cyan-500/15
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          <div
            className="
              bg-cyan-500/10
              p-3
              rounded-2xl
            "
          >
            <FolderKanban
              size={22}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h3
              className="
                text-xl
                font-extrabold
                tracking-tight
              "
            >
              {project.name}
            </h3>

            <p
              className="
                text-slate-500
                text-sm
                font-medium
              "
            >
              Project Workspace
            </p>
          </div>
        </div>

        <button
          onClick={(e) =>
            e.stopPropagation()
          }
          className="
            opacity-0
            group-hover:opacity-100
            transition
            text-slate-400
            hover:text-white
          "
        >
          <MoreVertical
            size={18}
          />
        </button>
      </div>

      {/* Description */}
      <p
        className="
          text-slate-400
          text-sm
          leading-6
          mb-6
          line-clamp-3
          min-h-18
        "
      >
        {project.description ||
          "No description available."}
      </p>

      {/* Status */}
      <div className="mb-5">
        <span
          className="
            inline-flex
            items-center
            gap-2
            bg-green-500/10
            text-green-400
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
          "
        >
          <span className="h-2 w-2 rounded-full bg-green-400" />
          Active
        </span>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={16} />

            <span className="font-medium">
              {project.members?.length ||
                1}{" "}
              Members
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <CalendarDays
              size={16}
            />

            <span className="font-medium">
              {createdDate}
            </span>
          </div>
        </div>
      </div>

      {/* Owner */}
      <div className="mt-5 flex items-center gap-3">
        <div
          className="
            h-11
            w-11
            rounded-full
            bg-linear-to-r
            from-cyan-500
            to-blue-600
            flex
            items-center
            justify-center
            font-bold
            shadow-lg
            shadow-cyan-500/20
          "
        >
          {project.owner?.name?.charAt(
            0
          ) || "A"}
        </div>

        <div>
          <p
            className="
              text-xs
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Owner
          </p>

          <p
            className="
              font-semibold
              tracking-tight
            "
          >
            {project.owner?.name ||
              "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}