import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import NotificationDropdown from "./NotificationDropdown";

import {
  getNotifications,
} from "../services/notificationService";

export default function Navbar() {
  const { user, logout } =
    useAuth();

  const navigate =
    useNavigate();

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const fetchNotifications =
    async () => {
      try {
        const data =
          await getNotifications();

        setNotifications(
          data
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    const interval =
      setInterval(() => {
        fetchNotifications();
      }, 30000);

    return () =>
      clearInterval(
        interval
      );
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Left */}
      <div>
        <h1
          className="
            text-5xl
            font-extrabold
            tracking-tight
            text-white
          "
        >
          Dashboard
        </h1>

        <p
          className="
            text-slate-400
            mt-2
            font-medium
          "
        >
          Welcome back,
          {" "}
          {user?.name}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-3
            bg-slate-900
            border
            border-slate-800
            px-4
            py-3
            rounded-2xl
            w-80
            shadow-lg
            shadow-cyan-500/5
          "
        >
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="
              bg-transparent
              outline-none
              w-full
              text-white
              placeholder:text-slate-500
            "
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
            className="
              relative
              bg-slate-900
              border
              border-slate-800
              p-3
              rounded-2xl
              hover:border-cyan-500
              hover:shadow-lg
              hover:shadow-cyan-500/10
              transition-all
            "
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  font-bold
                  min-w-5
                  h-5
                  px-1
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationDropdown
              notifications={
                notifications
              }
              refreshNotifications={
                fetchNotifications
              }
            />
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            bg-red-600
            hover:bg-red-700
            px-4
            py-3
            rounded-2xl
            flex
            items-center
            gap-2
            font-semibold
            transition-all
          "
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Profile */}
        <div
          className="
            flex
            items-center
            gap-3
            bg-slate-900
            border
            border-slate-800
            px-4
            py-2
            rounded-2xl
            shadow-lg
            shadow-cyan-500/5
          "
        >
          <div
            className="
              h-10
              w-10
              rounded-full
              bg-linear-to-r
              from-cyan-500
              to-blue-600
              flex
              items-center
              justify-center
            "
          >
            <User size={18} />
          </div>

          <div className="hidden lg:block">
            <p
              className="
                font-bold
                text-sm
                tracking-tight
              "
            >
              {user?.name}
            </p>

            <p
              className="
                text-xs
                text-slate-400
                font-medium
              "
            >
              {user?.role ||
                "Member"}
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-slate-400"
          />
        </div>
      </div>
    </header>
  );
}