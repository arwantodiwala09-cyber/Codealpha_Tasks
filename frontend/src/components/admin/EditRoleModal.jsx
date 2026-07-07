import { useState } from "react";

import {
  X,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";

export default function EditRoleModal({
  user,
  onClose,
  onSave,
}) {
  const [
    role,
    setRole,
  ] = useState(
    user?.role || "Member"
  );

  const handleSubmit = (
    e
  ) => {
    e.preventDefault();

    onSave(role);
  };

  return (
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
          w-full
          max-w-md
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          shadow-2xl
        "
      >
        {/* Header */}
        <div
          className="
            flex
            justify-between
            items-center
            p-6
            border-b
            border-slate-800
          "
        >
          <h2 className="text-2xl font-bold">
            Change Role
          </h2>

          <button
            onClick={
              onClose
            }
            className="
              p-2
              rounded-lg
              hover:bg-slate-800
              transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={
            handleSubmit
          }
          className="p-6"
        >
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-2">
              User
            </p>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="font-semibold">
                {user?.name}
              </p>

              <p className="text-sm text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-3">
              Select Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                outline-none
                focus:border-cyan-500
              "
            >
              <option value="Member">
                👤 Member
              </option>

              <option value="Manager">
                🛡 Manager
              </option>

              <option value="Admin">
                👑 Admin
              </option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">

            <div
              className={`
                rounded-2xl
                p-4
                text-center
                border
                ${
                  role ===
                  "Member"
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-700"
                }
              `}
            >
              <User
                className="mx-auto mb-2"
                size={22}
              />

              <p className="text-sm">
                Member
              </p>
            </div>

            <div
              className={`
                rounded-2xl
                p-4
                text-center
                border
                ${
                  role ===
                  "Manager"
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-slate-700"
                }
              `}
            >
              <Shield
                className="mx-auto mb-2"
                size={22}
              />

              <p className="text-sm">
                Manager
              </p>
            </div>

            <div
              className={`
                rounded-2xl
                p-4
                text-center
                border
                ${
                  role ===
                  "Admin"
                    ? "border-red-500 bg-red-500/10"
                    : "border-slate-700"
                }
              `}
            >
              <ShieldCheck
                className="mx-auto mb-2"
                size={22}
              />

              <p className="text-sm">
                Admin
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={
                onClose
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-slate-700
                hover:bg-slate-600
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-5
                py-3
                rounded-xl
                bg-cyan-600
                hover:bg-cyan-700
                font-semibold
                transition
              "
            >
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}