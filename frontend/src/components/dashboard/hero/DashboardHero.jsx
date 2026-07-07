import {
  Sparkles,
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function DashboardHero({
  user,
  projects,
  tasks,
}) {
  const navigate = useNavigate();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  const activeProjects = projects.length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "done"
  ).length;

  const dueToday = tasks.filter((task) => {
    if (!task.dueDate || task.status === "done")
      return false;

    const today = new Date();

    const due = new Date(task.dueDate);

    return (
      due.getDate() === today.getDate() &&
      due.getMonth() === today.getMonth() &&
      due.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <section
  className="
    relative
    z-0
    overflow-hidden
    rounded-[32px]
    border
    border-slate-800
    bg-gradient-to-r
    from-slate-900
    via-slate-900
    to-slate-800
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
<div
  className="
    absolute
    -bottom-20
    left-1/4
    h-72
    w-72
    rounded-full
    bg-blue-500/10
    blur-3xl
  "
/>
      <div className="relative flex flex-col lg:flex-row justify-between gap-10">

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                h-14
                w-14
                rounded-2xl
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
              <Sparkles size={26} />
            </div>

            <div>

              <p className="text-cyan-400 font-medium">
                {greeting}
              </p>

              <h1
  className="
    text-5xl
    font-black
    tracking-tight
    leading-tight
  "
>
                Welcome back,
                {" "}
                {user?.name}
              </h1>

            </div>

          </div>

          <p
  className="
    mt-5
    max-w-3xl
    text-[16px]
    leading-8
    text-slate-400
  "
>
            Here's everything happening across your
            workspace today.
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/projects")
          }
          className="
  self-start
  flex
  items-center
  gap-2
  rounded-2xl
  bg-cyan-500
  px-6
  py-4
  font-semibold
  transition-all
  duration-300
  hover:bg-cyan-600
  hover:scale-105
  hover:shadow-2xl
  hover:shadow-cyan-500/30
"
        >
          <Plus size={18} />

          New Project
        </button>

      </div>

      <div
        className="
          relative
          mt-10
          grid
          md:grid-cols-3
          gap-5
        "
      >

        <div
  className="
    rounded-3xl
    border
    border-slate-800/80
    bg-slate-900/60
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-500/40
    hover:shadow-xl
    hover:shadow-cyan-500/10
  "
>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
  <FolderKanban
    size={22}
    className="text-cyan-400"
  />
</div>

          <h2 className="text-3xl font-bold">
            {activeProjects}
          </h2>

          <p className="text-slate-400">
            Active Projects
          </p>
        </div>

        <div
  className="
    rounded-3xl
    border
    border-slate-800/80
    bg-slate-900/60
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-500/40
    hover:shadow-xl
    hover:shadow-cyan-500/10
  "
>
         <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10">
  <CheckSquare
    size={22}
    className="text-purple-400"
  />
</div>

          <h2 className="text-3xl font-bold">
            {pendingTasks}
          </h2>

          <p className="text-slate-400">
            Pending Tasks
          </p>
        </div>

        <div
  className="
    rounded-3xl
    border
    border-slate-800/80
    bg-slate-900/60
    backdrop-blur-xl
    p-6
    transition-all
    duration-300
    hover:-translate-y-1
    hover:border-cyan-500/40
    hover:shadow-xl
    hover:shadow-cyan-500/10
  "
>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10">
  <AlertTriangle
    size={22}
    className="text-yellow-400"
  />
</div>

          <h2 className="text-4xl font-black tracking-tight">
            {dueToday}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Due Today
          </p>
        </div>

      </div>

    </section>
  );
}