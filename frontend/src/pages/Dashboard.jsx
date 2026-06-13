import { useEffect, useState } from "react";

import {
  User,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Search,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import DashboardLayout from "../layout/DashboardLayout";

import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ActivityFeed from "../components/ActivityFeed";
import CreateProject from "../components/CreateProject";
import ProjectCard from "../components/ProjectCard";
import Board from "../components/Board";

import {
  getProjects,
  createProject,
} from "../services/projectService";

import {
  getMyTasks,
} from "../services/taskService";

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  async function fetchData() {
    try {
      const [
        projectsData,
        tasksData,
      ] = await Promise.all([
        getProjects(),
        getMyTasks(),
      ]);

      setProjects(
        projectsData
      );

      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject =
    async (projectData) => {
      try {
        await createProject(
          projectData
        );

        await fetchData();
      } catch (error) {
        console.error(error);

        alert(
          "Failed to create project"
        );
      }
    };

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const overdueTasks =
    tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(
          task.dueDate
        ) < new Date() &&
        task.status !== "done"
    ).length;

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );

  const filteredProjects =
    projects.filter(
      (project) =>
        project.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        project.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <DashboardLayout>
      <Navbar />

      {/* Welcome Banner */}
      <div
        className="
          bg-linear-to-r
          from-cyan-600
          to-blue-700
          rounded-3xl
          p-8
          mb-8
          shadow-2xl
          shadow-cyan-500/10
        "
      >
        <div className="flex items-center gap-5">
          <div
            className="
              bg-white/20
              p-5
              rounded-full
            "
          >
            <User size={36} />
          </div>

          <div>
            <h2
              className="
                text-3xl
                font-extrabold
                tracking-tight
              "
            >
              Welcome,
              {" "}
              {user?.name}
            </h2>

            <p className="text-cyan-100 mt-1">
              {user?.email}
            </p>

            <p className="text-cyan-200 text-sm mt-1">
              {user?.role ||
                "Member"}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">
        <StatsCard
          title="Projects"
          value={projects.length}
          icon={
            <FolderKanban
              size={34}
            />
          }
          color="text-cyan-400"
        />

        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          icon={
            <BarChart3
              size={34}
            />
          }
          color="text-purple-400"
        />

        <StatsCard
          title="Completed"
          value={completedTasks}
          icon={
            <CheckCircle2
              size={34}
            />
          }
          color="text-green-400"
        />

        <StatsCard
          title="Overdue"
          value={overdueTasks}
          icon={
            <AlertTriangle
              size={34}
            />
          }
          color="text-red-400"
        />
      </div>

      {/* Completion Progress */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-6
          mb-10
          shadow-xl
          shadow-cyan-500/5
        "
      >
        <div className="flex justify-between mb-3">
          <span
            className="
              text-slate-400
              font-medium
            "
          >
            Overall Task Completion
          </span>

          <span
            className="
              font-bold
              text-cyan-400
            "
          >
            {completionRate}%
          </span>
        </div>

        <div
          className="
            w-full
            h-3
            bg-slate-800
            rounded-full
            overflow-hidden
          "
        >
          <div
            className="
              h-full
              bg-cyan-500
              transition-all
              duration-700
            "
            style={{
              width:
                `${completionRate}%`,
            }}
          />
        </div>
      </div>

      {/* Search */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-4
          mb-8
          shadow-lg
          shadow-cyan-500/5
        "
      >
        <div className="flex items-center gap-3">
          <Search
            size={20}
            className="text-slate-500"
          />

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              bg-transparent
              outline-none
              w-full
              text-white
              placeholder:text-slate-500
            "
          />
        </div>
      </div>

      {/* Projects + Activity */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div
          className="
            lg:col-span-2
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
            shadow-xl
            shadow-cyan-500/5
          "
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className="
                text-2xl
                font-extrabold
                tracking-tight
              "
            >
              Projects
            </h2>

            <span className="text-slate-400 font-medium">
              {
                filteredProjects.length
              }{" "}
              Projects
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10">
              Loading...
            </div>
          ) : filteredProjects.length ===
            0 ? (
            <div className="text-center py-10 text-slate-500">
              No Projects Found
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {filteredProjects.map(
                (project) => (
                  <ProjectCard
                    key={
                      project._id
                    }
                    project={
                      project
                    }
                  />
                )
              )}
            </div>
          )}
        </div>

        <ActivityFeed />
      </div>

      {/* Create Project */}
      <div className="mb-10">
        <CreateProject
          onCreate={
            handleCreateProject
          }
        />
      </div>

      {/* Board */}
      <div className="mb-10">
        <h2
          className="
            text-3xl
            font-extrabold
            tracking-tight
            mb-6
          "
        >
          Project Board
        </h2>

        <Board tasks={tasks} />
      </div>
    </DashboardLayout>
  );
}