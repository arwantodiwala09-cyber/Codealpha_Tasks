import {
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CheckCircle2,
  MessageSquare,
  FolderKanban,
  UserPlus,
  UserMinus,
} from "lucide-react";

import {
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";

import {
  useSocket,
} from "../context/SocketContext";

export default function NotificationDropdown({
  notifications,
  refreshNotifications,
}) {
  const {
    socket,
  } = useSocket();

  const [
    liveNotifications,
    setLiveNotifications,
  ] = useState(
    notifications
  );

  useEffect(() => {
    setLiveNotifications(
      notifications
    );
  }, [notifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification =
      (
        notification
      ) => {
        setLiveNotifications(
          (prev) => {
            const exists =
              prev.some(
                (n) =>
                  n._id ===
                  notification._id
              );

            if (
              exists
            ) {
              return prev;
            }

            return [
              notification,
              ...prev,
            ];
          }
        );
      };

    socket.on(
      "newNotification",
      handleNewNotification
    );

    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );
    };
  }, [socket]);

  const unreadCount =
    liveNotifications.filter(
      (n) => !n.isRead
    ).length;

  const getIcon = (
    type
  ) => {
    switch (type) {
      case "task_completed":
        return (
          <CheckCircle2
            size={16}
            className="text-green-400"
          />
        );

      case "task_comment":
        return (
          <MessageSquare
            size={16}
            className="text-cyan-400"
          />
        );

      case "mention":
        return (
          <MessageSquare
            size={16}
            className="text-pink-400"
          />
        );

      case "project_created":
        return (
          <FolderKanban
            size={16}
            className="text-purple-400"
          />
        );

      case "member_added":
        return (
          <UserPlus
            size={16}
            className="text-blue-400"
          />
        );

      case "member_removed":
        return (
          <UserMinus
            size={16}
            className="text-red-400"
          />
        );

      default:
        return (
          <Bell
            size={16}
            className="text-yellow-400"
          />
        );
    }
  };

  return (
    <div
  className="
    absolute
    right-0
    top-14
    w-96
    rounded-2xl
    bg-slate-900
    border
    border-slate-800
    shadow-2xl
    z-[9999]
  "
>
      <div className="flex justify-between items-center p-4 border-b border-slate-800">
        <h3 className="font-bold">
          Notifications
        </h3>

        {unreadCount > 0 && (
          <button
            onClick={async () => {
              await markAllAsRead();
              refreshNotifications();
            }}
            className="
              text-cyan-400
              text-sm
            "
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {liveNotifications.length ===
        0 ? (
          <div className="p-6 text-center text-slate-500">
            No Notifications
          </div>
        ) : (
          liveNotifications.map(
            (
              notification
            ) => (
              <div
                key={
                  notification._id
                }
                className={`
                  p-4
                  border-b
                  border-slate-800
                  cursor-pointer
                  hover:bg-slate-800
                  transition
                  ${
                    !notification.isRead
                      ? "bg-cyan-500/5"
                      : ""
                  }
                `}
                onClick={async () => {
                  if (
                    !notification.isRead
                  ) {
                    await markAsRead(
                      notification._id
                    );

                    refreshNotifications();
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  {getIcon(
                    notification.type
                  )}

                  <div className="flex-1">
                    <p className="text-sm">
                      {
                        notification.message
                      }
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}