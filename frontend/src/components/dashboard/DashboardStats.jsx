import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Users,
  Shield,
  Briefcase,
} from "lucide-react";

import StatCard from "../ui/StatCard";

export default function DashboardStats({
  isAdmin = false,
  analytics = null,
  projects = [],
  tasks = [],
}) {
  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "done"
  ).length;

  if (isAdmin && analytics) {
    return (
      <section className="mb-12">

        <div className="mb-8">

          <h2
            className="
              text-3xl
              font-black
              tracking-tight
              bg-gradient-to-r
              from-white
              to-slate-300
              bg-clip-text
              text-transparent
            "
          >
            Workspace Statistics
          </h2>

          <p className="mt-2 text-base text-slate-400">
            Real-time insights into your users, projects and overall workspace performance.
          </p>

        </div>

        <div className="space-y-8">

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Users"
              value={analytics.totalUsers}
              icon={<Users size={28} />}
              color="cyan"
            />

            <StatCard
              title="Projects"
              value={analytics.totalProjects}
              icon={<FolderKanban size={28} />}
              color="purple"
            />

            <StatCard
              title="Tasks"
              value={analytics.totalTasks}
              icon={<BarChart3 size={28} />}
              color="yellow"
            />

            <StatCard
              title="Admins"
              value={analytics.totalAdmins}
              icon={<Shield size={28} />}
              color="red"
            />

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              title="Managers"
              value={analytics.totalManagers}
              icon={<Briefcase size={28} />}
              color="green"
            />

            <StatCard
              title="Members"
              value={analytics.totalMembers}
              icon={<Users size={28} />}
              color="blue"
            />

            <StatCard
              title="Completed"
              value={analytics.completedTasks}
              icon={<CheckCircle2 size={28} />}
              color="emerald"
            />

            <StatCard
              title="Overdue"
              value={analytics.overdueTasks}
              icon={<AlertTriangle size={28} />}
              color="red"
            />

          </div>

        </div>

      </section>
    );
  }

  return (
    <section className="mb-12">

      <div className="mb-8">

        <h2
          className="
            text-3xl
            font-black
            tracking-tight
            bg-gradient-to-r
            from-white
            to-slate-300
            bg-clip-text
            text-transparent
          "
        >
          My Workspace
        </h2>

        <p className="mt-2 text-base text-slate-400">
          A quick overview of your projects, tasks and current productivity.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Projects"
          value={projects.length}
          icon={<FolderKanban size={28} />}
          color="cyan"
        />

        <StatCard
          title="Tasks"
          value={tasks.length}
          icon={<BarChart3 size={28} />}
          color="purple"
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          icon={<CheckCircle2 size={28} />}
          color="emerald"
        />

        <StatCard
          title="Overdue"
          value={overdueTasks}
          icon={<AlertTriangle size={28} />}
          color="red"
        />

      </div>

    </section>
  );
}