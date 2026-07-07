import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

import {
  ArrowLeft,
  FolderKanban,
  Users,
  CalendarDays,
  CheckSquare,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import {
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
} from "../services/projectService";

import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

import CreateTaskModal from "../components/tasks/CreateTaskModal";
import EditTaskModal from "../components/tasks/EditTaskModal";
import ProjectKanban from "../components/tasks/ProjectKanban";
import ChatPanel from "../components/chat/ChatPanel";
import OnlineProjectMembers from "../components/project/OnlineProjectMembers";
import FileSharingCenter from "../components/files/FileSharingCenter";
import TaskCommentsModal from "../components/tasks/TaskCommentsModal";
import TaskActivityModal from "../components/tasks/TaskActivityModal";

export default function ProjectDetails() {
  const { id } = useParams();

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  // ==========================
  // State
  // ==========================

  const [project, setProject] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [memberEmail, setMemberEmail] =
    useState("");

  // ==========================
  // Modal State
  // ==========================

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [commentOpen, setCommentOpen] =
    useState(false);

  const [activityOpen, setActivityOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState(null);

  // ==========================
  // Modal Handlers
  // ==========================

  const openCreateModal = () =>
    setCreateOpen(true);

  const closeCreateModal = () =>
    setCreateOpen(false);

  const openEditModal = (task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setSelectedTask(null);
  };

  const openCommentModal = (task) => {
    setSelectedTask(task);
    setCommentOpen(true);
  };

  const closeCommentModal = () => {
    setCommentOpen(false);
    setSelectedTask(null);
  };

  const openActivityModal = (task) => {
    setSelectedTask(task);
    setActivityOpen(true);
  };

  const closeActivityModal = () => {
    setActivityOpen(false);
    setSelectedTask(null);
  };

  // ==========================
  // Load Project
  // ==========================

  const loadTasks = useCallback(async () => {
    try {
      const data =
        await getTasksByProject(id);

      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const loadProject =
    useCallback(async () => {
      try {
        const projectData =
          await getProjectById(id);

        setProject(projectData);

        const taskData =
          await getTasksByProject(id);

        setTasks(taskData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, [id]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // ==========================
  // Task CRUD
  // ==========================

  const handleCreateTask =
    useCallback(
      async (taskData) => {
        try {
          await createTask(taskData);

          await loadTasks();

          closeCreateModal();
        } catch (err) {
          console.error(err);
          alert("Failed to create task");
        }
      },
      [loadTasks]
    );

  const handleEditTask =
    useCallback(
      async (taskId, updatedData) => {
        try {
          await updateTask(
            taskId,
            updatedData
          );

          await loadTasks();

          closeEditModal();
        } catch (err) {
          console.error(err);
          alert("Failed to update task");
        }
      },
      [loadTasks]
    );

  const handleDeleteTask =
    useCallback(
      async (taskId) => {
        try {
          await deleteTask(taskId);

          await loadTasks();
        } catch (err) {
          console.error(err);
          alert("Failed to delete task");
        }
      },
      [loadTasks]
    );

  // ==========================
  // Members
  // ==========================

  const handleAddMember =
    useCallback(async () => {
      if (!memberEmail.trim())
        return;

      try {
        const updated =
          await addMemberToProject(
            id,
            memberEmail
          );

        setProject(updated);

        setMemberEmail("");
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Failed to add member"
        );
      }
    }, [id, memberEmail]);

  const handleRemoveMember =
    useCallback(
      async (userId) => {
        if (
          !window.confirm(
            "Remove this member?"
          )
        )
          return;

        try {
          const updated =
            await removeMemberFromProject(
              id,
              userId
            );

          setProject(updated);
        } catch (err) {
          alert(
            err.response?.data?.message ||
              "Failed to remove member"
          );
        }
      },
      [id]
    );

  // ==========================
  // Statistics
  // ==========================

  const completedTasks =
    useMemo(
      () =>
        tasks.filter(
          (t) => t.status === "done"
        ).length,
      [tasks]
    );

  const progress =
    useMemo(() => {
      if (!tasks.length)
        return 0;

      return Math.round(
        (completedTasks /
          tasks.length) *
          100
      );
    }, [tasks, completedTasks]);

  const isOwner =
    currentUser?._id ===
    project?.owner?._id;

  const canManageTasks =
    isOwner ||
    currentUser?.role === "Admin" ||
    currentUser?.role === "Manager";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading Project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Project Not Found
      </div>
    );
  }
  return (
  <div className="min-h-screen bg-slate-950 text-white p-8">
    <div className="mx-auto max-w-7xl">

      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
      >
        <ArrowLeft size={18} />
        Back To Projects
      </Link>

      {/* =========================
          Header
      ========================= */}

      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-r
          from-slate-900
          via-slate-900
          to-slate-800
          p-10
          mb-8
        "
      >

        <div
          className="
            absolute
            top-0
            right-0
            h-56
            w-56
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div className="relative flex flex-wrap items-center justify-between gap-8">

          <div className="flex items-center gap-5">

            <div
              className="
                rounded-3xl
                bg-gradient-to-br
                from-cyan-500
                to-blue-600
                p-5
                shadow-xl
                shadow-cyan-500/20
              "
            >
              <FolderKanban
                size={36}
                className="text-white"
              />
            </div>

            <div>

              <h1 className="text-5xl font-black">
                {project.name}
              </h1>

              <p className="mt-2 text-lg text-slate-300">
                Project Workspace
              </p>

            </div>

          </div>

          {canManageTasks && (
            <button
              onClick={openCreateModal}
              className="
                rounded-xl
                bg-cyan-500
                px-6
                py-3
                font-semibold
                transition
                hover:bg-cyan-600
                shadow-lg
                shadow-cyan-500/20
              "
            >
              + Create Task
            </button>
          )}

        </div>

        <div className="relative mt-8">

          <div className="mb-2 flex justify-between">

            <span className="text-sm text-slate-400">
              Project Progress
            </span>

            <span className="font-semibold text-cyan-400">
              {progress}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        <p className="mt-8 text-slate-300">
          {project.description ||
            "No description available."}
        </p>

      </div>

      {/* =========================
          Stats
      ========================= */}

      <div className="mb-8 grid gap-6 md:grid-cols-3 lg:grid-cols-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="mb-2 text-slate-400">
            Owner
          </p>

          <h3 className="font-bold">
            {project.owner?.name}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-2 flex items-center gap-2">
            <Users size={18} />
            Members
          </div>

          <h3 className="font-bold">
            {project.members?.length || 0}
          </h3>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-2 flex items-center gap-2">
            <CalendarDays size={18} />
            Created
          </div>

          <h3 className="font-bold">
            {new Date(
              project.createdAt
            ).toLocaleDateString()}
          </h3>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-2 flex items-center gap-2">
            <CheckSquare size={18} />
            Tasks
          </div>

          <h3 className="font-bold">
            {tasks.length}
          </h3>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 size={18} />
            Completed
          </div>

          <h3 className="font-bold text-green-400">
            {completedTasks}
          </h3>

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-2 flex items-center gap-2">
            <TrendingUp size={18} />
            Progress
          </div>

          <h3 className="font-bold text-cyan-400">
            {progress}%
          </h3>

        </div>

      </div>

      {/* =========================
          Invite Member
      ========================= */}

      {isOwner && (

        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="mb-6 text-2xl font-bold">
            Invite Team Member
          </h2>

          <div className="flex gap-4">

            <input
              type="email"
              value={memberEmail}
              placeholder="Enter user email"
              onChange={(e) =>
                setMemberEmail(
                  e.target.value
                )
              }
              className="
                flex-1
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-3
              "
            />

            <button
              onClick={handleAddMember}
              className="
                rounded-xl
                bg-cyan-500
                px-6
                font-medium
                hover:bg-cyan-600
              "
            >
              Add Member
            </button>

          </div>

        </div>

      )}

      {/* =========================
          Task Board
      ========================= */}

      <div className="mb-8">

        <h2 className="mb-6 text-3xl font-bold">
          Task Board
        </h2>

        <ProjectKanban
          tasks={tasks}
          members={project.members || []}
          canDelete={canManageTasks}
          canEdit={canManageTasks}
          onDelete={handleDeleteTask}
          onEdit={openEditModal}
          onComment={openCommentModal}
          onActivity={openActivityModal}
        />

      </div>

      {/* =========================
          Chat
      ========================= */}

      <div className="mb-8">
        <ChatPanel
          projectId={id}
        />
      </div>

      {/* =========================
          Files
      ========================= */}

      <div className="mb-8">
        <FileSharingCenter
          projectId={id}
        />
      </div>

      {/* =========================
          Online Members
      ========================= */}

      <OnlineProjectMembers
        members={project.members || []}
      />

      {/* =========================
          Team Members
      ========================= */}

      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Team Members
        </h2>

        <div className="space-y-4">

          {project.members?.map((member) => (

            <div
              key={member._id}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                bg-slate-800
                p-4
              "
            >

              <div>

                <h3 className="font-semibold">
                  {member.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {member.email}
                </p>

              </div>

              {project.owner?._id === member._id ? (

                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-400">
                  Owner
                </span>

              ) : (

                <div className="flex items-center gap-3">

                  <span className="text-cyan-400">
                    Member
                  </span>

                  {isOwner && (

                    <button
                      onClick={() =>
                        handleRemoveMember(
                          member._id
                        )
                      }
                      className="
                        rounded-lg
                        bg-red-500/10
                        px-3
                        py-1
                        text-xs
                        text-red-400
                        hover:bg-red-500/20
                      "
                    >
                      Remove
                    </button>

                  )}

                </div>

              )}

            </div>

          ))}

        </div>

      </div>
            {/* =========================
          Shared Modals
      ========================= */}

      <CreateTaskModal
        isOpen={createOpen}
        onClose={closeCreateModal}
        projectId={id}
        members={project.members || []}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        isOpen={editOpen}
        onClose={closeEditModal}
        task={selectedTask}
        members={project.members || []}
        onSave={async (updatedData) => {
          if (!selectedTask) return;

          await handleEditTask(
            selectedTask._id,
            updatedData
          );
        }}
      />

      <TaskCommentsModal
        isOpen={commentOpen}
        onClose={closeCommentModal}
        task={selectedTask}
      />

      <TaskActivityModal
        isOpen={activityOpen}
        onClose={closeActivityModal}
        task={selectedTask}
      />

    </div>
  </div>
);
}