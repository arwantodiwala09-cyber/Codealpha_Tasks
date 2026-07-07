import { useState } from "react";
import { X } from "lucide-react";

export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  members = [],
  onCreate,
}) {
  console.log("CreateTaskModal", isOpen);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onCreate({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      project: projectId,
    });

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("todo");
    setDueDate("");
    setAssignedTo("");

    onClose();
  };

  return (
    <>
  

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
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
              max-w-xl
              p-6
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Create Task
              </h2>

              <button
               onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
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
                "
              />

              <textarea
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Description"
                rows="4"
                className="
                  w-full
                  bg-slate-800
                  p-4
                  rounded-xl
                  mb-4
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

              <button
                type="submit"
                className="
                  w-full
                  bg-cyan-500
                  hover:bg-cyan-600
                  py-3
                  rounded-xl
                  font-medium
                "
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}