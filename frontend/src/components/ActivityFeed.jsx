import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CheckCircle2,
  FolderKanban,
  UserPlus,
  UserMinus,
  Clock,
  MessageSquare,
} from "lucide-react";

import {
  getNotifications,
} from "../services/notificationService";

export default function ActivityFeed() {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data =
          await getNotifications();

        setNotifications(
          data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const getTimeAgo = (
    date
  ) => {
    const seconds =
      Math.floor(
        (new Date() -
          new Date(date)) /
          1000
      );

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const key in intervals) {
      const value =
        Math.floor(
          seconds /
            intervals[key]
        );

      if (value >= 1) {
        return `${value} ${key}${
          value > 1
            ? "s"
            : ""
        } ago`;
      }
    }

    return "Just now";
  };

  const formatMessage = (
    message
  ) => {
    return message
      .replace(
        "You were added to project: ",
        "Added to "
      )
      .replace(
        "Task completed: ",
        "Completed "
      )
      .replace(
        "You have been assigned a new task: ",
        "Assigned "
      );
  };

  const getIcon = (
    type
  ) => {
    switch (type) {
      case "task_completed":
        return (
          <CheckCircle2
            size={18}
            className="text-green-400"
          />
        );

      case "project_created":
        return (
          <FolderKanban
            size={18}
            className="text-purple-400"
          />
        );

      case "member_added":
        return (
          <UserPlus
            size={18}
            className="text-cyan-400"
          />
        );

      case "member_removed":
        return (
          <UserMinus
            size={18}
            className="text-red-400"
          />
        );

      case "task_comment":
        return (
          <MessageSquare
            size={18}
            className="text-cyan-400"
          />
        );

      default:
        return (
          <Bell
            size={18}
            className="text-yellow-400"
          />
        );
    }
  };

  const getBadge = (
    type
  ) => {
    switch (type) {
      case "task_completed":
        return (
          <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">
            Completed
          </span>
        );

      case "task_assigned":
        return (
          <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full text-xs font-semibold">
            Assigned
          </span>
        );

      case "project_created":
        return (
          <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full text-xs font-semibold">
            Project
          </span>
        );

      case "member_added":
        return (
          <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-xs font-semibold">
            Member Added
          </span>
        );

      case "member_removed":
        return (
          <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-full text-xs font-semibold">
            Member Removed
          </span>
        );

      case "task_comment":
        return (
          <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full text-xs font-semibold">
            Commented
          </span>
        );

      default:
        return (
          <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">
            Notification
          </span>
        );
    }
  };

  const isToday = (
    date
  ) => {
    const today =
      new Date();

    const d =
      new Date(date);

    return (
      d.getDate() ===
        today.getDate() &&
      d.getMonth() ===
        today.getMonth() &&
      d.getFullYear() ===
        today.getFullYear()
    );
  };

  const todayNotifications =
    notifications.filter(
      (notification) =>
        isToday(
          notification.createdAt
        )
    );

  const olderNotifications =
    notifications.filter(
      (notification) =>
        !isToday(
          notification.createdAt
        )
    );

  const renderTimeline = (
    items
  ) =>
    items.map(
      (notification) => (
        <div
          key={
            notification._id
          }
          className="relative pl-10"
        >
          <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-lg shadow-cyan-500/30" />

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3 hover:border-cyan-500/30 transition-all">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {getIcon(
                  notification.type
                )}

                {getBadge(
                  notification.type
                )}
              </div>

              <span className="text-xs text-slate-500">
                {getTimeAgo(
                  notification.createdAt
                )}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-6">
              {formatMessage(
                notification.message
              )}
            </p>
          </div>
        </div>
      )
    );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl shadow-cyan-500/5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold">
          Activity Timeline
        </h2>

        <Clock
          size={18}
          className="text-cyan-400"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">
          Loading...
        </div>
      ) : notifications.length ===
        0 ? (
        <div className="text-center py-10 text-slate-500">
          No Activity Yet
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-px bg-slate-700" />

          <div className="space-y-8">
            {todayNotifications
              .length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-bold mb-5">
                  Today
                </h3>

                <div className="space-y-4">
                  {renderTimeline(
                    todayNotifications
                  )}
                </div>
              </div>
            )}

            {olderNotifications
              .length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] text-purple-400 font-bold mb-5">
                  Earlier
                </h3>

                <div className="space-y-4">
                  {renderTimeline(
                    olderNotifications
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}