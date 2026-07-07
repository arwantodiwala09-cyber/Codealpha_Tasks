import { useEffect, useMemo, useState } from "react";

import {
  CheckSquare,
  CalendarDays,
  Flag,
  Search,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import Navbar from "../components/Navbar";

import { getMyTasks } from "../services/taskService";
import StatCard from "../components/ui/StatCard";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getMyTasks();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  // ===================== METRICS =====================
  const metrics = useMemo(() => {
    const completed = tasks.filter(t => t.status === "done").length;

    const pending = tasks.filter(t => t.status !== "done").length;

    const overdue = tasks.filter(
      t =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "done"
    ).length;

    const progress =
      tasks.length === 0
        ? 0
        : Math.round((completed / tasks.length) * 100);

    return { completed, pending, overdue, progress };
  }, [tasks]);

  // ===================== FILTER =====================
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch = task.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all"
          ? true
          : task.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  // ===================== UI HELPERS =====================
  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-500/20 text-green-400";
      case "in-progress":
      case "progress":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-cyan-500/20 text-cyan-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-slate-400";
    }
  };

  // ===================== LOADING =====================
  if (loading) {
    return (
      <DashboardLayout>
        <Navbar />
        <div className="p-8 text-slate-400">
          Loading tasks...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Navbar />

      {/* HEADER */}
      {/* HERO */}

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
    mt-6
    mb-8
  "
>

  <div
    className="
      absolute
      -top-20
      -right-20
      h-72
      w-72
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />

  <div className="relative flex justify-between items-center">

    <div className="flex items-center gap-6">

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
        <CheckSquare size={38} />
      </div>

      <div>

        <p className="text-cyan-400 font-medium">
          Productivity Center
        </p>

        <h1 className="text-5xl font-black">
          My Tasks
        </h1>

        <p className="mt-3 text-slate-400 text-lg">
          Stay organized and complete your work efficiently.
        </p>

      </div>

    </div>

    <div className="hidden lg:block text-right">

      <h2 className="text-5xl font-black text-cyan-400">
        {tasks.length}
      </h2>

      <p className="text-slate-400">
        Assigned Tasks
      </p>

    </div>

  </div>

  {/* Progress */}

  <div className="mt-8">

    <div className="flex justify-between mb-2">

      <span className="text-sm text-slate-400">
        Overall Progress
      </span>

      <span className="text-cyan-400 font-semibold">
        {metrics.progress}%
      </span>

    </div>

    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">

      <div
        className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
        "
        style={{
          width: `${metrics.progress}%`,
        }}
      />

    </div>

  </div>

</div>

        {/* SEARCH */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-3 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="
              bg-slate-900
              border border-slate-800
              rounded-xl
              pl-10 pr-4 py-2
              text-sm
              outline-none
              text-white
            "
          />
        </div>
    

      {/* STATS CARDS */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

  <StatCard
    title="Completed"
    value={metrics.completed}
    icon={<CheckCircle2 size={30} />}
    color="text-green-400"
  />

  <StatCard
    title="Pending"
    value={metrics.pending}
    icon={<Clock3 size={30} />}
    color="text-yellow-400"
  />

  <StatCard
    title="Overdue"
    value={metrics.overdue}
    icon={<AlertTriangle size={30} />}
    color="text-red-400"
  />

  <StatCard
    title="Progress"
    value={`${metrics.progress}%`}
    icon={<CheckSquare size={30} />}
    color="text-cyan-400"
  />

</div>
      {/* FILTERS */}
      <div className="flex gap-3 mt-6">
        {["all", "todo", "in-progress", "done"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`
              px-4 py-2 rounded-xl text-sm border
              transition
              ${
                statusFilter === status
                  ? "bg-cyan-600 border-cyan-500 text-white"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/30"
              }
            `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      <div className="space-y-4 mt-6">
        {filteredTasks.length === 0 ? (
          <div className="py-14">

  <div
    className="
      mx-auto
      h-24
      w-24
      rounded-full
      bg-slate-800
      flex
      items-center
      justify-center
      mb-6
    "
  >
    <CheckSquare
      size={42}
      className="text-cyan-400"
    />
  </div>

  <h2 className="text-2xl font-bold">
    No Tasks Found
  </h2>

  <p className="text-slate-500 mt-3">
    Try changing the filters or create new tasks.
  </p>

</div>
        ) : (
filteredTasks.map((task) => {

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  return (

    <div
      key={task._id}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-slate-900
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-cyan-500/10
        ${
          isOverdue
            ? "border-red-500/40"
            : "border-slate-800 hover:border-cyan-500/40"
        }
      `}
    >

      {/* Priority Strip */}

      <div
        className={`
          absolute
          top-0
          left-0
          h-1
          w-full
          ${
            task.priority?.toLowerCase() === "high"
              ? "bg-red-500"
              : task.priority?.toLowerCase() === "medium"
              ? "bg-yellow-500"
              : "bg-cyan-500"
          }
        `}
      />

      {/* Header */}

      <div className="flex justify-between gap-5">

        <div className="flex gap-4 flex-1">

          <div
            className="
              h-12
              w-12
              rounded-full
              bg-gradient-to-br
              from-cyan-500
              to-blue-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              shrink-0
            "
          >
            {task.assignedTo?.name
              ? task.assignedTo.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

          <div className="min-w-0 flex-1">

            <h2 className="text-xl font-bold text-white truncate">
              {task.title}
            </h2>

            <p className="text-slate-400 mt-1">
              Assigned to{" "}
              <span className="text-cyan-400">
                {task.assignedTo?.name ||
                  "Unassigned"}
              </span>
            </p>

          </div>

        </div>

        <span
          className={`
            px-3
            py-1
            rounded-full
            text-xs
            font-semibold
            ${getStatusColor(task.status)}
          `}
        >
          {task.status}
        </span>

      </div>

      {/* Description */}

      {task.description && (

        <p
          className="
            mt-5
            text-slate-400
            leading-6
            line-clamp-2
          "
        >
          {task.description}
        </p>

      )}

      {/* Footer */}

      <div className="mt-6 pt-5 border-t border-slate-800">

        <div className="flex flex-wrap gap-3">

          <div
            className="
              px-3
              py-2
              rounded-xl
              bg-slate-800
              text-sm
              flex
              items-center
              gap-2
            "
          >
            <CalendarDays size={15} />

            {task.dueDate
              ? new Date(
                  task.dueDate
                ).toLocaleDateString()
              : "No Due Date"}
          </div>

          <div
            className={`
              px-3
              py-2
              rounded-xl
              bg-slate-800
              text-sm
              flex
              items-center
              gap-2
              ${getPriorityColor(task.priority)}
            `}
          >
            <Flag size={15} />

            {task.priority || "Low"}
          </div>

          {isOverdue && (

            <div
              className="
                px-3
                py-2
                rounded-xl
                bg-red-500/10
                text-red-400
                text-sm
                font-semibold
              "
            >
              ⚠ Overdue
            </div>

          )}

        </div>

      </div>

    </div>

  );

})
        )}
      </div>
    </DashboardLayout>
  );
}