import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {
  const location =
    useLocation();

  const menuItems = [
    {
      icon: (
        <LayoutDashboard
          size={20}
        />
      ),
      label: "Dashboard",
      path: "/",
    },
    {
      icon: (
        <FolderKanban
          size={20}
        />
      ),
      label: "Projects",
      path: "/projects",
    },
    {
      icon: (
        <CheckSquare
          size={20}
        />
      ),
      label: "My Tasks",
      path: "/my-tasks",
    },
    {
      icon: (
        <Users size={20} />
      ),
      label: "Team",
      path: "/team",
    },
    {
      icon: (
        <Settings
          size={20}
        />
      ),
      label: "Settings",
      path: "/settings",
    },
  ];

  const isActive = (
    path
  ) => {
    if (
      path === "/"
    ) {
      return (
        location.pathname ===
        "/"
      );
    }

    return location.pathname.startsWith(
      path
    );
  };

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-4xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          TaskFlow
        </h1>

        <p className="text-slate-500 mt-2 text-sm">
          Project Management Platform
        </p>
      </div>

      <nav className="flex-1 px-5 py-8">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-4">
          Main Menu
        </p>

        <div className="space-y-2">
          {menuItems.map(
            (item) => {
              const active =
                isActive(
                  item.path
                );

              return (
                <Link
                  key={
                    item.label
                  }
                  to={item.path}
                  className={`
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    ${
                      active
                        ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                        : "hover:bg-slate-800 text-slate-300"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}

                    <span>
                      {item.label}
                    </span>
                  </div>

                  {active && (
                    <ChevronRight
                      size={16}
                    />
                  )}
                </Link>
              );
            }
          )}
        </div>
      </nav>

      <div className="p-5">
        <div className="bg-linear-to-br from-cyan-600 to-blue-700 rounded-2xl p-5">
          <h3 className="font-bold text-lg">
            Pro Workspace
          </h3>

          <p className="text-cyan-100 text-sm mt-2">
            Manage projects,
            tasks and teams
            efficiently.
          </p>

          <button className="mt-4 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}