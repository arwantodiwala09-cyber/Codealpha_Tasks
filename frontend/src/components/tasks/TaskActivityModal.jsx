import {
  useEffect,
  useState,
} from "react";

import {
  History,
  X,
  PlusCircle,
  RefreshCcw,
  UserPlus,
  MessageSquare,
  Trash2,
} from "lucide-react";

import {
  getTaskActivity,
} from "../../services/activityService";

export default function TaskActivityModal({
  task,
}) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {
  if (!open || !task) return;

    const loadActivity =
      async () => {
        try {
          setLoading(true);

          const data =
            await getTaskActivity(
              task._id
            );

          setActivities(
            data
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setLoading(false);
        }
      };

    loadActivity();
  }, [
  open,
  task,
]);;

  const getIcon = (
    action
  ) => {
    switch (action) {
      case "created":
        return (
          <PlusCircle
            size={18}
            className="text-cyan-400"
          />
        );

      case "status_changed":
        return (
          <RefreshCcw
            size={18}
            className="text-yellow-400"
          />
        );

      case "assigned":
        return (
          <UserPlus
            size={18}
            className="text-green-400"
          />
        );

      case "commented":
        return (
          <MessageSquare
            size={18}
            className="text-purple-400"
          />
        );

      case "deleted":
      case "comment_deleted":
        return (
          <Trash2
            size={18}
            className="text-red-400"
          />
        );

      default:
        return (
          <History
            size={18}
            className="text-slate-400"
          />
        );
    }
  };
if (!task) return null;
  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          text-slate-400
          hover:text-cyan-400
          transition
        "
      >
        <History size={16} />
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              w-full
              max-w-3xl
              p-6
              max-h-[85vh]
              overflow-hidden
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Task Activity
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
              >
                <X />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {loading ? (
                <div className="text-center py-10 text-slate-500">
                  Loading...
                </div>
              ) : activities.length ===
                0 ? (
                <div className="text-center py-10 text-slate-500">
                  No Activity Yet
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700" />

                  <div className="space-y-6">
                    {activities.map(
                      (
                        activity
                      ) => (
                        <div
                          key={
                            activity._id
                          }
                          className="relative pl-12"
                        >
                          <div className="absolute left-0 top-1 bg-slate-900 border border-slate-700 rounded-full p-2">
                            {getIcon(
                              activity.action
                            )}
                          </div>

                          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
                            <p className="text-white">
                              {
                                activity.description
                              }
                            </p>

                            <p className="text-xs text-slate-500 mt-2">
                              {new Date(
                                activity.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}