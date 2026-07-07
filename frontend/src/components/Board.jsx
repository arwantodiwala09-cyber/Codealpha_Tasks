import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  Clock,
  Flag,
  MoreVertical,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useSocket } from "../context/SocketContext";
// import { updateTaskStatus } from "../services/taskService"; // enable when backend ready

/* ================= TASK CARD ================= */
function TaskCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-slate-800/80
        border border-slate-700
        rounded-2xl
        p-4
        cursor-grab
        active:cursor-grabbing
        hover:border-cyan-500/30
        transition
        ${isDragging ? "opacity-50 scale-105" : ""}
      `}
    >
      <div className="flex justify-between">
        <h4 className="font-semibold text-sm">{task.title}</h4>
        <MoreVertical size={16} className="text-slate-400" />
      </div>

      <p className="text-xs text-slate-400 mt-2">
        {task.description || "No description"}
      </p>

      <div className="flex justify-between mt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No date"}
        </span>

        <span
          className={`px-2 py-1 rounded-full ${
            task.priority === "high"
              ? "bg-red-500/10 text-red-400"
              : task.priority === "medium"
              ? "bg-yellow-500/10 text-yellow-400"
              : "bg-green-500/10 text-green-400"
          }`}
        >
          <Flag size={12} className="inline mr-1" />
          {task.priority || "low"}
        </span>
      </div>
    </div>
  );
}

/* ================= COLUMN ================= */
function Column({ title, items, color }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 min-h-[500px]">

      <div className="flex justify-between mb-4">
        <h3 className="font-bold">{title}</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${color}`}>
          {items.length}
        </span>
      </div>

      <SortableContext
        items={items.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </SortableContext>

    </div>
  );
}

/* ================= BOARD ================= */
export default function Board({ tasks = [] }) {
  const [localTasks, setLocalTasks] = useState([]);

  const { socket } = useSocket();

  /* SAFE SYNC */
  useEffect(() => {
    if (Array.isArray(tasks)) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  /* REALTIME SYNC */
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (updatedTask) => {
      setLocalTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? updatedTask : t
        )
      );
    };

    socket.on("taskUpdated", handleUpdate);

    return () => socket.off("taskUpdated", handleUpdate);
  }, [socket]);

  /* COLUMN DATA */
  const columns = {
    todo: localTasks.filter((t) => t.status === "todo"),
    inProgress: localTasks.filter((t) => t.status === "in-progress"),
    done: localTasks.filter((t) => t.status === "done"),
  };

  /* SAFE COLUMN DETECTOR */
  const getStatusFromId = (id) => {
    if (columns.todo.some((t) => t._id === id)) return "todo";
    if (columns.inProgress.some((t) => t._id === id)) return "in-progress";
    if (columns.done.some((t) => t._id === id)) return "done";
    return null;
  };

  /* DRAG HANDLER (STABLE) */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;

    const newStatus =
      getStatusFromId(over.id) ||
      getStatusFromId(activeId);

    if (!newStatus) return;

    const updated = localTasks.map((task) =>
      task._id === activeId
        ? { ...task, status: newStatus }
        : task
    );

    setLocalTasks(updated);

    // BACKEND HOOK (ENABLE WHEN READY)
    // updateTaskStatus(activeId, newStatus);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <Column
          title="To Do"
          items={columns.todo}
          color="bg-blue-500/10 text-blue-400"
        />

        <Column
          title="In Progress"
          items={columns.inProgress}
          color="bg-yellow-500/10 text-yellow-400"
        />

        <Column
          title="Done"
          items={columns.done}
          color="bg-green-500/10 text-green-400"
        />

      </div>
    </DndContext>
  );
}