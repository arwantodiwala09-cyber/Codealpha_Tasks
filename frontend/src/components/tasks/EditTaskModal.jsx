import { useState } from "react";
import { X, Pencil } from "lucide-react";

export default function EditTaskModal({
  task,
  members = [],
  onEdit,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [priority,
    setPriority] =
    useState("Medium");

  const [status, setStatus] =
    useState("todo");

  const [dueDate,
    setDueDate] =
    useState("");

  const [assignedTo,
    setAssignedTo] =
    useState("");

  const openModal = () => {
    setTitle(task.title || "");

    setDescription(
      task.description || ""
    );

    setPriority(
      task.priority || "Medium"
    );

    setStatus(
      task.status || "todo"
    );

    setDueDate(
      task.dueDate
        ? task.dueDate.split("T")[0]
        : ""
    );

    setAssignedTo(
      task.assignedTo?._id || ""
    );

    setIsOpen(true);

    document.body.style.overflow =
      "hidden";
  };

  const closeModal = () => {
    setIsOpen(false);

    document.body.style.overflow =
      "auto";
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await onEdit(task._id, {
        title,
        description,
        priority,
        status,
        dueDate,
        assignedTo,
      });

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="
          text-cyan-400
          hover:text-cyan-300
          transition
        "
      >
        <Pencil size={16} />
      </button>

      {isOpen && (
        <div
          onClick={closeModal}
          className="
            fixed
            top-0
            left-0
            w-screen
            h-screen
            bg-black/80
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              w-full
              max-w-xl
              p-6
              shadow-2xl
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Edit Task
              </h2>

              <button
                onClick={closeModal}
                className="
                  text-slate-400
                  hover:text-white
                "
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Task Title"
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-4
                  border
                  border-slate-700
                "
              />

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows="5"
                placeholder="Description"
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-4
                  border
                  border-slate-700
                "
              />

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-4
                "
              >
                <option>
                  Low
                </option>
                <option>
                  Medium
                </option>
                <option>
                  High
                </option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-4
                "
              />

              <select
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-4
                "
              >
                <option value="">
                  Unassigned
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={
                        member._id
                      }
                      value={
                        member._id
                      }
                    >
                      {member.name}
                    </option>
                  )
                )}
              </select>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-6
                "
              >
                <option value="todo">
                  To Do
                </option>

                <option value="progress">
                  In Progress
                </option>

                <option value="review">
                  Review
                </option>

                <option value="done">
                  Done
                </option>
              </select>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  className="
                    flex-1
                    bg-slate-700
                    hover:bg-slate-600
                    py-3
                    rounded-xl
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-cyan-500
                    hover:bg-cyan-600
                    py-3
                    rounded-xl
                  "
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}