import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
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
    // eslint-disable-next-line react-hooks/immutability
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        const data =
          await getNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const formatType = (
    type
  ) => {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

  const getTimeAgo = (
    date
  ) => {
    const seconds =
      Math.floor(
        (new Date() -
          new Date(date)) /
          1000
      );

    const minutes =
      Math.floor(
        seconds / 60
      );

    const hours =
      Math.floor(
        minutes / 60
      );

    const days =
      Math.floor(
        hours / 24
      );

    if (
      seconds < 60
    )
      return "Just now";

    if (
      minutes < 60
    )
      return `${minutes} min ago`;

    if (
      hours < 24
    )
      return `${hours} hour${
        hours > 1 ? "s" : ""
      } ago`;

    if (
      days < 7
    )
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;

    return new Date(
      date
    ).toLocaleDateString();
  };

  return (
    <div
      className="
    bg-slate-900
    border
    border-slate-800
    rounded-3xl
    p-6
    h-fit
    shadow-xl
    shadow-cyan-500/5
  "
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Bell
          size={20}
          className="text-cyan-400"
        />

        <h2 className="text-2xl font-extrabold tracking-tight">
          Activity Feed
        </h2>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10 text-slate-500">
          Loading activity...
        </div>
      ) : notifications.length ===
        0 ? (
        <div className="text-center py-10 text-slate-500">
          No activity found
        </div>
      ) : (
        <div className="space-y-5 max-h-125 overflow-y-auto pr-2">
          {notifications.map(
            (
              notification
            ) => (
              <div
                key={
                  notification._id
                }
                className={`
                  border-l-2
                  pl-4
                  transition-all
                  ${
                    notification.isRead
                      ? "border-slate-600 opacity-80"
                      : "border-cyan-500"
                  }
                `}
              >
                <p className="text-white text-sm font-medium leading-6">
                  {
                    notification.message
                  }
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className="
                      text-xs
                      bg-cyan-500/10
                      text-cyan-400
                      px-2
                      py-1
                      rounded-full
                    "
                  >
                    {formatType(
                      notification.type
                    )}
                  </span>

                  <span className="text-slate-600">
                    •
                  </span>

                  <span className="text-xs text-slate-500">
                    {getTimeAgo(
                      notification.createdAt
                    )}
                  </span>

                  {!notification.isRead && (
                    <>
                      <span className="text-slate-600">
                        •
                      </span>

                      <span
                        className="
                          text-xs
                          text-cyan-400
                          font-medium
                        "
                      >
                        New
                      </span>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}