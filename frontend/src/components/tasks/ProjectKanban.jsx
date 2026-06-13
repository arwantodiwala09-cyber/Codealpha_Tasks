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

function Column({
  columnId,
  title,
  icon,
  color,
  tasks,
  members,
  onDelete,
  onEdit,
  canDelete,
  canEdit,
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
              min-h-150
              space-y-4
              transition
              ${
                snapshot.isDraggingOver
                  ? "bg-cyan-500/5"
                  : ""
              }
            `}
          >
            {tasks.map(
              (
                task,
                index
              ) => (
                <Draggable
                  key={task._id}
                  draggableId={
                    task._id
                  }
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={
                        provided.innerRef
                      }
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ProjectTaskCard
                        task={task}
                        members={
                          members
                        }
                        onDelete={
                          onDelete
                        }
                        onEdit={
                          onEdit
                        }
                        canDelete={
                          canDelete
                        }
                        canEdit={
                          canEdit
                        }
                      />
                    </div>
                  )}
                </Draggable>
              )
            )}

            {
              provided.placeholder
            }

            {tasks.length ===
              0 && (
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
}

export default function ProjectKanban({
  tasks,
  members,
  onDelete,
  onEdit,
  canDelete = false,
  canEdit = false,
}) {
  const handleDragEnd =
    async (result) => {
      if (
        !result.destination
      )
        return;

      const taskId =
        result.draggableId;

      const newStatus =
        result.destination
          .droppableId;

      const task =
        tasks.find(
          (t) =>
            t._id === taskId
        );

      if (
        !task ||
        task.status ===
          newStatus
      ) {
        return;
      }

      try {
        await onEdit(
          taskId,
          {
            status:
              newStatus,
          }
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const columns = [
    {
      id: "todo",
      title: "To Do",
      icon: (
        <Circle size={18} />
      ),
      color:
        "text-slate-400",
    },
    {
      id: "progress",
      title:
        "In Progress",
      icon: (
        <Loader2
          size={18}
        />
      ),
      color:
        "text-cyan-400",
    },
    {
      id: "review",
      title: "Review",
      icon: (
        <Eye size={18} />
      ),
      color:
        "text-yellow-400",
    },
    {
      id: "done",
      title: "Done",
      icon: (
        <CheckCircle2
          size={18}
        />
      ),
      color:
        "text-green-400",
    },
  ];

  return (
    <DragDropContext
      onDragEnd={
        handleDragEnd
      }
    >
      <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-6">
        {columns.map(
          (column) => (
            <Column
              key={
                column.id
              }
              columnId={
                column.id
              }
              title={
                column.title
              }
              icon={
                column.icon
              }
              color={
                column.color
              }
              tasks={tasks.filter(
                (t) =>
                  t.status ===
                  column.id
              )}
              members={
                members
              }
              onDelete={
                onDelete
              }
              onEdit={
                onEdit
              }
              canDelete={
                canDelete
              }
              canEdit={
                canEdit
              }
            />
          )
        )}
      </div>
    </DragDropContext>
  );
}