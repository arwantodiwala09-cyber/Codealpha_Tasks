import { useState } from "react";
import {
  PlusCircle,
  FolderPlus,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

export default function CreateProject({
  onCreate,
}) {
  const { user } =
    useAuth();

  if (
    user?.role ===
    "Member"
  ) {
    return null;
  }

  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    template,
    setTemplate,
  ] = useState("Blank");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      await onCreate({
        name,
        description,
        template,
      });

      setName("");
      setDescription("");
      setTemplate("Blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        overflow-hidden
        shadow-xl
        shadow-cyan-500/5
      "
    >
      <div
        className="
          bg-linear-to-r
          from-cyan-600/20
          to-blue-600/20
          border-b
          border-slate-800
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              bg-cyan-500/20
              p-3
              rounded-2xl
            "
          >
            <FolderPlus
              size={28}
              className="text-cyan-400"
            />
          </div>

          <div>
            <h2
              className="
                text-2xl
                font-extrabold
                tracking-tight
              "
            >
              Create New Project
            </h2>

            <p
              className="
                text-slate-400
                text-sm
                mt-1
                font-medium
              "
            >
              Available for Admins and Managers
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6"
      >
        <div className="space-y-5">

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-300
                mb-2
              "
            >
              Project Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter project name..."
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                px-4
                py-4
                text-white
                placeholder:text-slate-500
                focus:outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
              "
            />
          </div>

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-300
                mb-2
              "
            >
              Description
            </label>

            <textarea
              rows="5"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe your project..."
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                px-4
                py-4
                text-white
                placeholder:text-slate-500
                focus:outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
                resize-none
              "
            />
          </div>

          <div>
            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-300
                mb-2
              "
            >
              Project Template
            </label>

            <select
              value={template}
              onChange={(e) =>
                setTemplate(
                  e.target.value
                )
              }
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                px-4
                py-4
                text-white
                focus:outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-500/20
              "
            >
              <option value="Blank">
                Blank
              </option>

              <option value="Web Development">
                🌐 Web Development
              </option>

              <option value="Mobile App">
                📱 Mobile App
              </option>

              <option value="Research Project">
                🔬 Research Project
              </option>

              <option value="Hackathon">
                🏆 Hackathon
              </option>

              <option value="College Project">
                🎓 College Project
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              bg-linear-to-r
              from-cyan-500
              to-blue-600
              hover:from-cyan-600
              hover:to-blue-700
              px-6
              py-3
              rounded-2xl
              flex
              items-center
              gap-2
              font-semibold
              shadow-lg
              transition-all
              disabled:opacity-50
            "
          >
            <PlusCircle
              size={18}
            />

            {loading
              ? "Creating..."
              : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}