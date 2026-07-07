import {
  FolderKanban,
  ArrowRight,
  Users,
  CalendarDays,
} from "lucide-react";

import Card from "../ui/Card";

export default function RecentProjectsCard({
  projects = [],
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
        hover:border-purple-500/40
        hover:shadow-2xl
        hover:shadow-purple-500/10
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -top-12
          -right-12
          h-44
          w-44
          rounded-full
          bg-purple-500/10
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
              bg-purple-500/10
              flex
              items-center
              justify-center
            "
          >
            <FolderKanban
              size={22}
              className="text-purple-400"
            />
          </div>

          <div>

            <h2 className="text-xl font-bold">
              Recent Projects
            </h2>

            <p className="text-sm text-slate-400">
              Latest active workspace projects
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
            text-purple-400
            hover:text-purple-300
            transition
          "
        >
          View All

          <ArrowRight size={15} />

        </button>

      </div>

      {projects.length === 0 ? (

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
          <FolderKanban
            size={42}
            className="text-slate-600 mb-4"
          />

          <p className="text-slate-500">
            No projects available
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {projects
            .slice(0, 4)
            .map((project) => (

              <div
                key={project._id}
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
                  hover:border-purple-500/40
                  hover:bg-slate-900
                  hover:-translate-y-1
                "
              >

                <div
                  className="
                    absolute
                    left-0
                    top-0
                    bottom-0
                    w-1
                    bg-purple-500
                    scale-y-0
                    origin-top
                    transition-transform
                    duration-300
                    group-hover:scale-y-100
                  "
                />

                <div className="flex gap-4">

                  <div
                    className="
                      h-14
                      w-14
                      rounded-2xl
                      bg-purple-500/10
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <FolderKanban
                      size={24}
                      className="text-purple-400"
                    />
                  </div>

                  <div className="flex-1 min-w-0">

                    <h3 className="truncate text-lg font-bold">
                      {project.name}
                    </h3>

                    {project.description && (

                      <p
                        className="
                          mt-2
                          line-clamp-2
                          text-sm
                          leading-6
                          text-slate-400
                        "
                      >
                        {project.description}
                      </p>

                    )}

                    <div className="mt-5 flex flex-wrap gap-4">

                      <div className="flex items-center gap-2 text-sm text-slate-400">

                        <Users
                          size={15}
                          className="text-cyan-400"
                        />

                        <span>
                          {project.owner?.name ||
                            "Unknown"}
                        </span>

                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-400">

                        <CalendarDays
                          size={15}
                          className="text-yellow-400"
                        />

                        <span>
                          {new Date(
                            project.createdAt
                          ).toLocaleDateString()}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

        </div>

      )}

    </Card>
  );
}