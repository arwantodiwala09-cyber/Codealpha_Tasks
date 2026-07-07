import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  User,
  FolderKanban,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import Navbar from "../components/Navbar";
import StatCard from "../components/ui/StatCard";

import {
  getUserProfile,
} from "../services/userService";

export default function Profile() {
  const { id } =
    useParams();

  const [profile,
    setProfile] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data =
          await getUserProfile(
            id
          );

        setProfile(
          data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Navbar />

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
      top-0
      right-0
      w-64
      h-64
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />

  <div className="relative flex items-center gap-6">
          <div
  className="
    h-24
    w-24
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
            <User size={40} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {profile.user.name}
            </h1>

           <p className="text-slate-300 mt-2">
  {profile.user.email}
</p>

            <span
  className="
    inline-block
    mt-3
    px-4
    py-1
    rounded-full
    bg-cyan-500/10
    text-cyan-400
    text-sm
    font-semibold
  "
>
  {profile.user.role}
</span>

            <p className="mt-4 text-sm text-slate-400">
              Joined{" "}
              {new Date(
                profile.user.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">

  <StatCard
    title="Projects"
    value={profile.stats.totalProjects}
    icon={<FolderKanban size={30} />}
    color="text-cyan-400"
  />

  <StatCard
    title="Tasks"
    value={profile.stats.totalTasks}
    icon={<BarChart3 size={30} />}
    color="text-purple-400"
  />

  <StatCard
    title="Completed"
    value={profile.stats.completedTasks}
    icon={<CheckCircle2 size={30} />}
    color="text-green-400"
  />

  <StatCard
    title="Completion"
    value={`${profile.stats.completionRate}%`}
    icon={<CheckCircle2 size={30} />}
    color="text-yellow-400"
  />

</div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
         <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-2xl font-bold">
      Assigned Projects
    </h2>

    <p className="text-sm text-slate-400 mt-1">
      Projects you're currently working on
    </p>
  </div>
</div>

          <div className="space-y-3">
            {profile.projects.map(
              (
                project
              ) => (
                <div
  key={project._id}
  className="
    bg-slate-800
    border
    border-slate-700
    rounded-2xl
    p-5
    transition-all
    hover:border-cyan-500/40
    hover:-translate-y-1
    hover:shadow-lg
    hover:shadow-cyan-500/10
  "
>
  <h3 className="font-semibold text-white">
    {project.name}
  </h3>

  <p className="text-sm text-slate-400 mt-2">
    Active Project
  </p>
</div>
              )
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-2xl font-bold">
      Assigned Tasks
    </h2>

    <p className="text-sm text-slate-400 mt-1">
      Tasks assigned to you
    </p>
  </div>
</div>

          <div className="space-y-3">
            {profile.tasks.map(
              (
                task
              ) => (
                <div
  key={task._id}
  className="
    bg-slate-800
    border
    border-slate-700
    rounded-2xl
    p-5
    transition-all
    hover:border-purple-500/40
    hover:-translate-y-1
    hover:shadow-lg
    hover:shadow-purple-500/10
  "
>
  <h3 className="font-semibold">
    {task.title}
  </h3>

  <p className="text-sm text-slate-400 mt-2">
    Status: {task.status}
  </p>
</div>
              )
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}