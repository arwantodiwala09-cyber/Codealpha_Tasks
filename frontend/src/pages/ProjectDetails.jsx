import { useEffect, useState } from "react";
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
  deleteTask,
  updateTask,
} from "../services/taskService";

import CreateTaskModal from "../components/tasks/CreateTaskModal";
import ProjectKanban from "../components/tasks/ProjectKanban";

export default function ProjectDetails() {
  const { id } = useParams();

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [project, setProject] =
    useState(null);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [memberEmail,
    setMemberEmail] =
    useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function loadTasks() {
    try {
      const data =
        await getTasksByProject(id);

      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadProject() {
      try {
        const projectData =
          await getProjectById(id);

        setProject(projectData);

        await loadTasks();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [id, loadTasks]);

  const handleCreateTask =
    async (taskData) => {
      try {
        await createTask(taskData);
        await loadTasks();
      } catch (error) {
        console.error(error);
        alert(
          "Failed to create task"
        );
      }
    };

  const handleDeleteTask =
    async (taskId) => {
      try {
        await deleteTask(taskId);
        await loadTasks();
      } catch (error) {
        console.error(error);
        alert(
          "Failed to delete task"
        );
      }
    };

  const handleEditTask =
    async (
      taskId,
      updatedData
    ) => {
      try {
        await updateTask(
          taskId,
          updatedData
        );

        await loadTasks();
      } catch (error) {
        console.error(error);
        alert(
          "Failed to update task"
        );
      }
    };

  const handleAddMember =
    async () => {
      if (
        !memberEmail.trim()
      )
        return;

      try {
        const updatedProject =
          await addMemberToProject(
            id,
            memberEmail
          );

        setProject(
          updatedProject
        );

        setMemberEmail("");

        alert(
          "Member added successfully"
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to add member"
        );
      }
    };

  const handleRemoveMember =
    async (userId) => {
      const confirmRemove =
        window.confirm(
          "Remove this member from the project?"
        );

      if (!confirmRemove)
        return;

      try {
        const updatedProject =
          await removeMemberFromProject(
            id,
            userId
          );

        setProject(
          updatedProject
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to remove member"
        );
      }
    };

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );

  const isOwner =
    currentUser?._id ===
    project?.owner?._id;

  const canManageTasks =
    isOwner ||
    currentUser?.role === "Admin" ||
    currentUser?.role === "Manager";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Project Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/projects"
          className="
            inline-flex
            items-center
            gap-2
            text-cyan-400
            hover:text-cyan-300
            mb-6
          "
        >
          <ArrowLeft size={18} />
          Back To Projects
        </Link>

        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500/10 p-4 rounded-2xl">
              <FolderKanban
                size={36}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {project.name}
              </h1>

              <p className="text-slate-400">
                Project Workspace
              </p>
            </div>
          </div>

          <p className="text-slate-300 mt-6">
            {project.description ||
              "No description available."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid lg:grid-cols-6 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-slate-400 mb-2">
              Owner
            </h3>

            <p className="font-bold text-lg">
              {project.owner?.name}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} />
              Members
            </div>

            <p className="font-bold text-lg">
              {project.members?.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDays size={18} />
              Created
            </div>

            <p className="font-bold text-lg">
              {new Date(
                project.createdAt
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare size={18} />
              Tasks
            </div>

            <p className="font-bold text-lg">
              {tasks.length}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={18} />
              Completed
            </div>

            <p className="font-bold text-lg text-green-400">
              {completedTasks}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} />
              Progress
            </div>

            <p className="font-bold text-lg text-cyan-400">
              {progress}%
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Invite Team Member
            </h2>

            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter user email"
                value={memberEmail}
                onChange={(e) =>
                  setMemberEmail(
                    e.target.value
                  )
                }
                className="
                  flex-1
                  bg-slate-800
                  border
                  border-slate-700
                  rounded-xl
                  px-4
                  py-3
                "
              />

              <button
                onClick={
                  handleAddMember
                }
                className="
                  bg-cyan-500
                  hover:bg-cyan-600
                  px-6
                  rounded-xl
                  font-medium
                "
              >
                Add Member
              </button>
            </div>
          </div>
        )}

        {canManageTasks && (
          <CreateTaskModal
            projectId={id}
            members={
              project.members || []
            }
            onCreate={
              handleCreateTask
            }
          />
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">
            Task Board
          </h2>

          <ProjectKanban
            tasks={tasks}
            members={
              project.members || []
            }
            onDelete={
              handleDeleteTask
            }
            onEdit={
              handleEditTask
            }
            canDelete={
              canManageTasks
            }
            canEdit={
              canManageTasks
            }
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">
            Team Members
          </h2>

          <div className="space-y-4">
            {project.members?.map(
              (member) => (
                <div
                  key={member._id}
                  className="
                    bg-slate-800
                    rounded-xl
                    p-4
                    flex
                    justify-between
                    items-center
                  "
                >
                  <div>
                    <h3 className="font-semibold">
                      {member.name}
                    </h3>

                    <p className="text-slate-400 text-sm">
                      {member.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {project.owner
                      ?._id ===
                    member._id ? (
                      <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs">
                        Owner
                      </span>
                    ) : (
                      <>
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
                              bg-red-500/10
                              text-red-400
                              hover:bg-red-500/20
                              px-3
                              py-1
                              rounded-lg
                              text-xs
                            "
                          >
                            Remove
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}