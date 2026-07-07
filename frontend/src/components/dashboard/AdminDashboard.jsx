import AdminCharts from "../AdminCharts";

import DashboardStats from "./DashboardStats";
import RecentUsersCard from "./RecentUsersCard";
import RecentProjectsCard from "./RecentProjectsCard";
import RecentTasksCard from "./RecentTasksCard";

export default function AdminDashboard({
  analytics,
  projects,
  tasks,
}) {
  if (!analytics) return null;

  return (
    <>
      {/* Dashboard Statistics */}
      <DashboardStats
        isAdmin
        analytics={analytics}
        projects={projects}
        tasks={tasks}
      />

      {/* Charts */}
      <section className="mb-12">
        <AdminCharts
          taskStatusChart={analytics.taskStatusChart}
          roleDistribution={analytics.roleDistribution}
        />
      </section>

      {/* Divider */}
      <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      {/* Workspace Overview */}
      <section className="mb-10">

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
            Workspace Overview
          </h2>

          <p
            className="
              mt-3
              max-w-3xl
              text-base
              leading-7
              text-slate-400
            "
          >
            Monitor recently joined members, newly created projects and
            task activity across your entire workspace from one place.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">

          <RecentUsersCard
            users={analytics.recentUsers || []}
          />

          <RecentProjectsCard
            projects={analytics.recentProjects || []}
          />

          <RecentTasksCard
            tasks={analytics.recentTasks || []}
          />

        </div>

      </section>
    </>
  );
}