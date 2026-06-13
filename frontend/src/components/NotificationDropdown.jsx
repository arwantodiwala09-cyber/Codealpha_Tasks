import {
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";

export default function NotificationDropdown({
  notifications,
  refreshNotifications,
}) {
  const unreadCount =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  return (
    <div
      className="
        absolute
        right-0
        top-14
        w-96
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        shadow-2xl
        z-50
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
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            No Notifications
          </div>
        ) : (
          notifications.map(
            (notification) => (
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
            )
          )
        )}
      </div>
    </div>
  );
}