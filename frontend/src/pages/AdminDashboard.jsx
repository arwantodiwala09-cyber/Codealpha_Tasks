import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  Users,
  FolderKanban,
  CheckSquare,
  Shield,
  Search,
  RefreshCw,
} from "lucide-react";

import {
  getAdminStats,
  getUsers,
  searchUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from "../services/adminService";

import DashboardCards from "../components/admin/DashboardCards";
import UserTable from "../components/admin/UserTable";
import EditRoleModal from "../components/admin/EditRoleModal";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [statistics, userList] = await Promise.all([
        getAdminStats(),
        getUsers(),
      ]);

      setStats(statistics);
      setUsers(userList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword) => {
    setSearch(keyword);

    try {
      if (!keyword.trim()) {
        const list = await getUsers();
        setUsers(list);
        return;
      }

      const result = await searchUsers(keyword);
      setUsers(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleUpdate = async (role) => {
    try {
      await updateUserRole(selectedUser._id, role);
      setShowRoleModal(false);
      loadDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async (id) => {
    try {
      await toggleUserStatus(id);
      loadDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      loadDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-slate-950 min-h-screen text-white">
        <Sidebar />
        <main className="flex-1 p-8">
          <Navbar />
          <h2 className="text-3xl font-bold">
            Loading Admin Dashboard...
          </h2>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-950 text-white min-h-screen">

      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">

        <Navbar />

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Manage users, projects and workspace.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="
              flex items-center gap-2
              bg-cyan-600/90 hover:bg-cyan-600
              px-5 py-3
              rounded-2xl
              font-semibold
              transition
              hover:scale-[1.02]
            "
          >
            <RefreshCw size={18} />
            Refresh
          </button>

        </div>

        {/* STATS */}
        <DashboardCards
          cards={[
            {
              title: "Users",
              value: stats.totalUsers,
              icon: <Users size={28} />,
              color: "text-cyan-400",
            },
            {
              title: "Projects",
              value: stats.totalProjects,
              icon: <FolderKanban size={28} />,
              color: "text-yellow-400",
            },
            {
              title: "Tasks",
              value: stats.totalTasks,
              icon: <CheckSquare size={28} />,
              color: "text-green-400",
            },
            {
              title: "Completed",
              value: stats.completedTasks,
              icon: <Shield size={28} />,
              color: "text-purple-400",
            },
          ]}
        />

        {/* USER MANAGEMENT */}
        <div className="mt-10 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">
              User Management
            </h2>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-500"
              />

              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="
                  bg-slate-800/80
                  border border-slate-700
                  rounded-xl
                  pl-10 pr-4 py-2
                  outline-none
                  w-72
                  focus:border-cyan-500/50
                "
              />

            </div>

          </div>

          <UserTable
            users={users}
            onEditRole={(user) => {
              setSelectedUser(user);
              setShowRoleModal(true);
            }}
            onBlock={handleBlock}
            onDelete={handleDelete}
          />

        </div>

        {/* MODAL */}
        {showRoleModal && (
          <EditRoleModal
            user={selectedUser}
            onClose={() => setShowRoleModal(false)}
            onSave={handleRoleUpdate}
          />
        )}

        {/* INFO GRID */}
        <div className="grid lg:grid-cols-2 gap-6 mt-10">

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-5">
              Workspace Overview
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-400">Total Users</span>
                <span>{stats.totalUsers}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Active Projects</span>
                <span>{stats.activeProjects}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Total Tasks</span>
                <span>{stats.totalTasks}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Completed</span>
                <span className="text-green-400">{stats.completedTasks}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Pending</span>
                <span className="text-yellow-400">{stats.pendingTasks}</span>
              </div>

            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold mb-5">
              Admin Tips
            </h2>

            <div className="space-y-3 text-slate-400 text-sm">
              <p>• Assign Managers to projects</p>
              <p>• Block inactive users</p>
              <p>• Monitor reports regularly</p>
              <p>• Keep roles updated</p>
              <p>• Track productivity daily</p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}