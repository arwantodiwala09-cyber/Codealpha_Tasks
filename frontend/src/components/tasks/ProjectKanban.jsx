import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";

import {
  Circle,
  Loader2,
  Eye,
  CheckCircle2,
} from "lucide-react";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import ProjectTaskCard from "./ProjectTaskCard";

import {
  useSocket,
} from "../../context/SocketContext";

const Column = memo(function Column({
  columnId,
  title,
  icon,
  color,
  tasks,
  members,
  onDelete,
  onEdit,
  onComment,
  onActivity,
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        overflow-hidden
      "
    >
      <div
        className="
          p-5
          border-b
          border-slate-800
          flex
          justify-between
          items-center
        "
      >
        <div className="flex items-center gap-3">
          <div className={color}>
            {icon}
          </div>

          <h3 className="font-bold text-lg">
            {title}
          </h3>
        </div>

        <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              p-4
              min-h-[600px]
              space-y-4
              ${
                snapshot.isDraggingOver
                  ? "bg-cyan-500/5"
                  : ""
              }
            `}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task._id}
                draggableId={task._id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ProjectTaskCard
    task={task}
    members={members}
    onEdit={onEdit}
    onDelete={onDelete}
    onComment={onComment}
    onActivity={onActivity}
    canEdit={true}
    canDelete={true}
/>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {tasks.length === 0 && (
              <div
                className="
                  h-40
                  border-2
                  border-dashed
                  border-slate-700
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  text-slate-500
                "
              >
                Drop Tasks Here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
});

const COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    icon: <Circle size={18} />,
    color: "text-slate-400",
  },
  {
    id: "progress",
    title: "In Progress",
    icon: <Loader2 size={18} />,
    color: "text-cyan-400",
  },
  {
    id: "review",
    title: "Review",
    icon: <Eye size={18} />,
    color: "text-yellow-400",
  },
  {
    id: "done",
    title: "Done",
    icon: <CheckCircle2 size={18} />,
    color: "text-green-400",
  },
];
export default function ProjectKanban({
  tasks,
  members,
  onDelete,
  onEdit,
  onComment,
  onActivity,
  canDelete = false,
  canEdit = false,
}) {
  const { socket } = useSocket();

  const [liveTasks, setLiveTasks] = useState(tasks);

  useEffect(() => {
    setLiveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (task) => {
      setLiveTasks((prev) => {
        if (prev.some((t) => t._id === task._id)) {
          return prev;
        }

        return [task, ...prev];
      });
    };

    const handleTaskUpdated = (updatedTask) => {
      setLiveTasks((prev) =>
        prev.map((task) =>
          task._id === updatedTask._id
            ? updatedTask
            : task
        )
      );
    };

    const handleTaskDeleted = ({ taskId }) => {
      setLiveTasks((prev) =>
        prev.filter((task) => task._id !== taskId)
      );
    };

    socket.on("taskCreated", handleTaskCreated);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);

    return () => {
      socket.off("taskCreated", handleTaskCreated);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
    };
  }, [socket]);

  const handleDragEnd = useCallback(
  async (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const task = liveTasks.find(
      (t) => t._id === taskId
    );

    if (!task) return;

    if (task.status === newStatus) return;

    try {
      onEdit({
        ...task,
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
    }
  },
  [liveTasks, onEdit]
);

 const groupedTasks = useMemo(() => {
  const grouped = {
    todo: [],
    progress: [],
    review: [],
    done: [],
  };

  liveTasks.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    } else {
      grouped.todo.push(task);
    }
  });

  return grouped;
}, [liveTasks]);
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
        {COLUMNS.map((column) => (
          <Column
  key={column.id}
  columnId={column.id}
  title={column.title}
  icon={column.icon}
  color={column.color}
  tasks={groupedTasks[column.id]}
  members={members}
  onDelete={onDelete}
  onEdit={onEdit}
  onComment={onComment}
  onActivity={onActivity}
  canDelete={canDelete}
  canEdit={canEdit}
/>
        ))}
      </div>
    </DragDropContext>
  );
}

