import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  Users,
  Settings,
  Shield,
  ChevronRight,
  BarChart3,
  Sparkles,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";


export default function Sidebar() {
  const location = useLocation();

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <FolderKanban size={20} />,
      label: "Projects",
      path: "/projects",
    },
    {
      icon: <CheckSquare size={20} />,
      label: "My Tasks",
      path: "/my-tasks",
    },
    {
      icon: <CalendarDays size={20} />,
      label: "Calendar",
      path: "/calendar",
    },
    {
      icon: <Users size={20} />,
      label: "Team",
      path: "/team",
    },

    ...(currentUser?.role === "Admin" ||
    currentUser?.role === "Manager"
      ? [
          {
            icon: <BarChart3 size={20} />,
            label: "Reports",
            path: "/reports",
          },
        ]
      : []),

    ...(currentUser?.role === "Admin"
      ? [
          {
            icon: <Shield size={20} />,
            label: "Admin Dashboard",
            path: "/admin",
          },
        ]
      : []),

    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
    return (
    <aside className="sticky top-0 h-screen w-72 shrink-0 overflow-hidden border-r border-slate-800/70 bg-slate-950/95 backdrop-blur-xl flex flex-col">

      {/* HEADER (fixed) */}
      <div className="shrink-0 border-b border-slate-800/70 p-8">

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight">
              <span className="bg-linear-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Project Management Platform
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 text-lg font-bold">
            {currentUser?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold">
              {currentUser?.name}
            </h3>
            <p className="truncate text-sm text-slate-400">
              {currentUser?.role}
            </p>
          </div>
        </div>

      </div>

      {/* MIDDLE (ONLY SCROLL AREA) */}
      <div className="flex-1 min-h-0 overflow-hidden">

        <nav className="h-full overflow-y-auto px-5 py-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Main Menu
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`
                    group
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    px-4
                    py-3.5
                    transition-all
                    duration-300

                    ${
                      active
                        ? "border-cyan-400/30 bg-linear-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 shadow-xl shadow-cyan-500/20 scale-[1.02]"
                        : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/70 hover:text-white hover:translate-x-1"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        active ? "bg-cyan-500/10" : "bg-slate-800 group-hover:bg-slate-700"
                      }`}
                    >
                      {item.icon}
                    </div>

                    <span className="font-medium tracking-wide">
                      {item.label}
                    </span>
                  </div>

                  {active && (
                    <ChevronRight size={18} className="text-cyan-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

      </div>

      {/* FOOTER (fixed) */}
      <div className="shrink-0 border-t border-slate-800/70 p-5">

        <div className="rounded-3xl border border-cyan-500/20 bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 p-6 shadow-2xl shadow-cyan-500/20">

          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-300" />
            <span className="text-sm font-semibold uppercase tracking-wider text-cyan-100">
              Pro Workspace
            </span>
          </div>

          <h3 className="text-xl font-bold">Work Smarter</h3>

          <p className="mt-3 text-sm leading-6 text-cyan-100">
            Manage projects, tasks, teams, analytics and productivity from one workspace.
          </p>

          <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:scale-[1.02] hover:bg-slate-100">
            Explore Workspace
          </button>

        </div>

      </div>

    </aside>
  );
}