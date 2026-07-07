import {
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../context/SocketContext";

import NotificationDropdown from "./NotificationDropdown";
import GlobalSearch from "./search/GlobalSearch";

import { getNotifications } from "../services/notificationService";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitles = {
    "/": "Dashboard",
    "/projects": "Projects",
    "/my-tasks": "My Tasks",
    "/calendar": "Calendar",
    "/team": "Team",
    "/reports": "Reports",
    "/settings": "Settings",
    "/admin": "Admin Dashboard",
  };

  const pageTitle =
    pageTitles[location.pathname] || "Dashboard";

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notification._id))
          return prev;

        return [notification, ...prev];
      });
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <header
  className="
    relative
    z-50
    mb-10
    flex
    items-start
    justify-between
    gap-8
    rounded-3xl
    border
    border-slate-800/70
    bg-slate-900/40
    backdrop-blur-xl
    px-8
    py-6
  "
>

      {/* LEFT */}
      <div>
        <h1 className="text-5xl font-black tracking-tight">
          {pageTitle}
        </h1>

        <p className="mt-3 text-base text-slate-400">
          Welcome back,{" "}
          <span className="font-semibold text-cyan-400">
            {user?.name}
          </span>
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        <div className="relative">
          <button
            onClick={() =>
              setShowNotifications(!showNotifications)
            }
            className="
relative
rounded-2xl
border
border-slate-800
bg-slate-900/80
backdrop-blur-xl
p-3
transition-all
duration-300
hover:-translate-y-0.5
hover:border-cyan-500/40
hover:shadow-lg
hover:shadow-cyan-500/10
"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-lg shadow-red-500/40">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              refreshNotifications={fetchNotifications}
            />
          )}
        </div>

        <button
          onClick={handleLogout}
          className="
flex
items-center
gap-2
rounded-2xl
bg-red-600
px-5
py-3
font-semibold
transition-all
duration-300
hover:-translate-y-0.5
hover:bg-red-700
hover:shadow-lg
hover:shadow-red-500/30
"
        >
          <LogOut size={18} />
          Logout
        </button>

        <div className="
flex
items-center
gap-3
rounded-2xl
border
border-slate-800
bg-slate-900/80
backdrop-blur-xl
px-4
py-2
transition-all
duration-300
hover:border-cyan-500/30
hover:shadow-lg
hover:shadow-cyan-500/10
">

          <div className="
flex
h-11
w-11
items-center
justify-center
rounded-full
bg-gradient-to-br
from-cyan-500
to-blue-600
shadow-lg
shadow-cyan-500/25
">
            <User size={18} />
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-bold">
              {user?.name}
            </p>

            <p className="text-xs text-slate-400">
              {user?.role || "Member"}
            </p>
          </div>

          <ChevronDown
  size={16}
  className="
    text-slate-500
    transition-transform
    duration-300
    group-hover:rotate-180
  "
/>
        </div>

      </div>

    </header>
  );
}