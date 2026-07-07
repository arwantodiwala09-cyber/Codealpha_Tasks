import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  FolderKanban,
  FileText,
  Clock3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";

import {
  getProjectReport,
  getTaskReport,
  getTimeReport,
  getProductivityReport,
} from "../services/reportService";

import {
  exportPDF,
  exportExcel,
  exportCSV,
} from "../utils/exportReports";

function SummaryCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
        hover:border-cyan-500
        transition
      "
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>
        </div>

        <div className={color}>
          {icon}
        </div>

      </div>
    </div>
  );
}

export default function Reports() {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    projectReport,
    setProjectReport,
  ] = useState([]);

  const [
    taskReport,
    setTaskReport,
  ] = useState([]);

  const [
    timeReport,
    setTimeReport,
  ] = useState([]);

  const [
    productivityReport,
    setProductivityReport,
  ] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports =
    async () => {
      try {

        const [
          projects,
          tasks,
          time,
          productivity,
        ] = await Promise.all([
          getProjectReport(),
          getTaskReport(),
          getTimeReport(),
          getProductivityReport(),
        ]);

        setProjectReport(projects);
        setTaskReport(tasks);
        setTimeReport(time);
        setProductivityReport(
          productivity
        );

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="flex bg-slate-950 min-h-screen text-white">
        <Sidebar />

        <main className="flex-1 p-8">
          <Navbar />

          <h2 className="text-2xl font-bold">
            Loading Reports...
          </h2>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        <Navbar />

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Reports
            </h1>

            <p className="text-slate-400 mt-2">
              Project analytics, productivity and exports.
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                exportPDF(
                  "Project Report",
                  projectReport
                )
              }
              className="
                flex
                items-center
                gap-2
                bg-red-600
                hover:bg-red-700
                px-4
                py-3
                rounded-xl
                font-semibold
              "
            >
              <FileDown size={18} />
              PDF
            </button>

            <button
              onClick={() =>
                exportExcel(
                  "Project Report",
                  projectReport
                )
              }
              className="
                flex
                items-center
                gap-2
                bg-green-600
                hover:bg-green-700
                px-4
                py-3
                rounded-xl
                font-semibold
              "
            >
              <FileSpreadsheet size={18} />
              Excel
            </button>

            <button
              onClick={() =>
                exportCSV(
                  "Project Report",
                  projectReport
                )
              }
              className="
                flex
                items-center
                gap-2
                bg-cyan-600
                hover:bg-cyan-700
                px-4
                py-3
                rounded-xl
                font-semibold
              "
            >
              <Download size={18} />
              CSV
            </button>

          </div>

        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">

          <SummaryCard
            title="Projects"
            value={projectReport.length}
            icon={
              <FolderKanban size={34} />
            }
            color="text-cyan-400"
          />

          <SummaryCard
            title="Tasks"
            value={taskReport.length}
            icon={
              <FileText size={34} />
            }
            color="text-yellow-400"
          />

          <SummaryCard
            title="Time Logs"
            value={timeReport.length}
            icon={
              <Clock3 size={34} />
            }
            color="text-green-400"
          />

          <SummaryCard
            title="Team Productivity"
            value={productivityReport.length}
            icon={
              <TrendingUp size={34} />
            }
            color="text-purple-400"
          />

        </div>
                {/* Project Summary */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-6">
            Project Summary
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700 text-slate-400">

                  <th className="text-left py-3">
                    Project
                  </th>

                  <th className="text-left py-3">
                    Owner
                  </th>

                  <th className="text-center py-3">
                    Progress
                  </th>

                  <th className="text-center py-3">
                    Completed
                  </th>

                </tr>

              </thead>

              <tbody>

                {projectReport.map(
                  (project) => (
                    <tr
                      key={
                        project.project
                      }
                      className="border-b border-slate-800 hover:bg-slate-800"
                    >
                      <td className="py-4 font-semibold">
                        {
                          project.project
                        }
                      </td>

                      <td>
                        {project.owner}
                      </td>

                      <td className="text-center">
                        {
                          project.progress
                        }
                        %
                      </td>

                      <td className="text-center">
                        {
                          project.completedTasks
                        }
                        /
                        {
                          project.totalTasks
                        }
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Task Report */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-6">
            Task Report
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700 text-slate-400">

                  <th className="text-left py-3">
                    Task
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>

                  <th className="text-left py-3">
                    Priority
                  </th>

                  <th className="text-left py-3">
                    Assignee
                  </th>

                </tr>

              </thead>

              <tbody>

                {taskReport.map(
                  (task) => (
                    <tr
                      key={task._id}
                      className="border-b border-slate-800 hover:bg-slate-800"
                    >
                      <td className="py-4">
                        {task.title}
                      </td>

                      <td>
                        {task.status}
                      </td>

                      <td>
                        {task.priority}
                      </td>

                      <td>
                        {task.assignedTo?.name ||
                          "Unassigned"}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

{/* Time Tracking */}

<div
  className="
    bg-slate-900
    border
    border-slate-800
    rounded-3xl
    p-6
    mb-8
  "
>
  <h2 className="text-2xl font-bold mb-6">
    Time Tracking
  </h2>

  <div className="space-y-4">

    {timeReport.length === 0 ? (

      <p className="text-slate-400">
        No time logs found.
      </p>

    ) : (

      timeReport.map((log) => {

        const duration = Number(log.duration || 0);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);

        return (
          <div
            key={log._id}
            className="
              bg-slate-800
              rounded-2xl
              p-4
              flex
              justify-between
              items-center
            "
          >
            <div>

              <h3 className="font-semibold">
                {log.task?.title || "No Task"}
              </h3>

              <p className="text-slate-400 text-sm">
                {log.user?.name || "Unknown User"}
              </p>

            </div>

            <div className="font-bold text-cyan-400">
              {hours}h {minutes}m
            </div>

          </div>
        );

      })

    )}

  </div>

</div>
        {/* Productivity */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
          "
        >
          <h2 className="text-2xl font-bold mb-6">
            Productivity Report
          </h2>

          <div className="space-y-4">

            {productivityReport.map(
              (user) => (
                <div
                  key={user.user}
                  className="
                    bg-slate-800
                    rounded-2xl
                    p-5
                    flex
                    justify-between
                    items-center
                  "
                >
                  <div>

                    <h3 className="font-semibold">
                      {user.user}
                    </h3>

                    <p className="text-slate-400 text-sm">
                      {user.completed}
                      {" / "}
                      {user.total}
                      {" "}
                      Tasks Completed
                    </p>

                  </div>

                  <div className="text-3xl font-bold text-green-400">
                    {user.productivity}%
                  </div>

                </div>
              )
            )}

          </div>

        </div>

      </main>

    </div>
  );
}