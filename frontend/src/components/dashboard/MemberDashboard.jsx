import ActivityFeed from "../ActivityFeed";
import Board from "../Board";
import CreateProject from "../CreateProject";
import ProjectCard from "../ProjectCard";

import DashboardStats from "./DashboardStats";

export default function MemberDashboard({
  projects = [],
  tasks = [],
  onCreateProject,
}) {
  return (
    <>
      {/* Dashboard Statistics */}
      <DashboardStats
        projects={projects}
        tasks={tasks}
      />

      {/* Recent Activity */}
      <section className="mb-10">
        <ActivityFeed />
      </section>

      {/* Create Project */}
      <section className="mb-10">
        <CreateProject
          onCreate={onCreateProject}
        />
      </section>

      {/* Projects */}
      <section className="mb-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Your Projects
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Projects you're currently involved in.
            </p>
          </div>

          <div className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
            {projects.length} Project{projects.length !== 1 ? "s" : ""}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 py-20 text-center">
            <h3 className="text-lg font-semibold text-white">
              No Projects Yet
            </h3>

            <p className="mt-2 text-slate-400">
              Create your first project to start collaborating.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

      {/* Kanban Board */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Task Board
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Track and manage your assigned work.
          </p>
        </div>

        <Board
          tasks={tasks}
        />
      </section>
    </>
  );
}