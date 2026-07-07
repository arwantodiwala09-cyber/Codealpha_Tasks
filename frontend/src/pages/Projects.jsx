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

      {/* Hero */}

<div
  className="
    relative
    overflow-hidden
    bg-gradient-to-r
    from-slate-900
    via-slate-900
    to-slate-800
    border
    border-slate-800
    rounded-3xl
    p-10
    mb-8
  "
>

  <div
    className="
      absolute
      -top-16
      -right-16
      h-64
      w-64
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />

  <div className="relative flex justify-between items-center">

    <div className="flex items-center gap-5">

      <div
        className="
          h-20
          w-20
          rounded-3xl
          bg-gradient-to-br
          from-cyan-500
          to-blue-600
          flex
          items-center
          justify-center
          shadow-xl
          shadow-cyan-500/20
        "
      >
        <FolderKanban size={36} />
      </div>

      <div>

        <h1 className="text-5xl font-black tracking-tight">
          Projects
        </h1>

        <p className="mt-3 text-slate-400 text-lg">
          Manage, organize and collaborate across all your projects.
        </p>

      </div>

    </div>

    <div className="hidden lg:block">

      <div className="text-right">

        <h2 className="text-5xl font-black text-cyan-400">
          {projects.length}
        </h2>

        <p className="text-slate-400">
          Total Projects
        </p>

      </div>

    </div>

  </div>

</div>

      {/* Search */}
      <div className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-5
mb-8
shadow-lg
">
        <div className="flex items-center gap-3">
          <Search
  size={22}
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
w-full
bg-transparent
text-lg
placeholder:text-slate-500
outline-none
"
          />
        </div>
      </div>

      {/* Main Layout */}
<div className="grid xl:grid-cols-4 gap-8">

  {/* Left Content */}
  <div className="xl:col-span-3">

    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-3xl font-black tracking-tight">
          All Projects
        </h2>

        <span
          className="
            px-4
            py-2
            rounded-full
            bg-cyan-500/10
            text-cyan-400
            font-semibold
          "
        >
          {filteredProjects.length} Projects
        </span>

      </div>

      {loading ? (

        <div className="text-center py-16">
          Loading Projects...
        </div>

      ) : filteredProjects.length === 0 ? (

        <div className="text-center py-16">

          <div
            className="
              mx-auto
              mb-6
              h-24
              w-24
              rounded-full
              bg-slate-800
              flex
              items-center
              justify-center
            "
          >
            <FolderKanban
              size={42}
              className="text-cyan-400"
            />
          </div>

          <h3 className="text-2xl font-black">
            No Projects Found
          </h3>

          <p className="text-slate-500 mt-3">
            Create your first project to get started.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 gap-6">

          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}

        </div>

      )}

    </div>

  </div>

  {/* Right Sidebar */}
  <div className="space-y-6 sticky top-24 self-start">

    <CreateProject
      onCreate={handleCreateProject}
    />

    <ActivityFeed />

  </div>

</div>
</DashboardLayout>
);
}