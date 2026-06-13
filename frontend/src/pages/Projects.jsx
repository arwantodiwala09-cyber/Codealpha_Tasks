import {
  useEffect,
  useState,
} from "react";

import {
  FolderKanban,
  Search,
} from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";

import Navbar from "../components/Navbar";
import ActivityFeed from "../components/ActivityFeed";
import CreateProject from "../components/CreateProject";
import ProjectCard from "../components/ProjectCard";

import {
  getProjects,
  createProject,
} from "../services/projectService";

export default function Projects() {
  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  async function fetchProjects() {
    try {
      const data =
        await getProjects();

      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, []);

  const handleCreateProject =
    async (projectData) => {
      try {
        await createProject(
          projectData
        );

        await fetchProjects();
      } catch (error) {
        console.error(error);
      }
    };

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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Projects
        </h1>

        <p className="text-slate-400 mt-2">
          Manage and organize all
          your projects
        </p>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8">
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
            "
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid xl:grid-cols-4 gap-6">
        {/* Projects Section */}
        <div className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              All Projects
            </h2>

            <span className="text-slate-400">
              {
                filteredProjects.length
              }{" "}
              Projects
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              Loading Projects...
            </div>
          ) : filteredProjects.length ===
            0 ? (
            <div className="text-center py-16">
              <FolderKanban
                size={60}
                className="mx-auto text-slate-600 mb-4"
              />

              <h3 className="text-xl font-bold">
                No Projects Found
              </h3>

              <p className="text-slate-500 mt-2">
                Create your first
                project to get
                started.
              </p>
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

        {/* Right Sidebar */}
        <div className="space-y-6">
          <CreateProject
            onCreate={
              handleCreateProject
            }
          />

          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}