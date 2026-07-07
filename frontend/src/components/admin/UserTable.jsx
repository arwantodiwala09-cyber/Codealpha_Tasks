import {
  Shield,
  ShieldCheck,
  UserCog,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";

export default function UserTable({
  users,
  onEditRole,
  onBlock,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-700 text-slate-400">

            <th className="text-left py-4">
              User
            </th>

            <th className="text-left py-4">
              Email
            </th>

            <th className="text-left py-4">
              Role
            </th>

            <th className="text-center py-4">
              Status
            </th>

            <th className="text-center py-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {users.length === 0 ? (
            <tr>

              <td
                colSpan="5"
                className="py-10 text-center text-slate-500"
              >
                No users found.
              </td>

            </tr>
          ) : (
            users.map(
              (user) => (
                <tr
                  key={user._id}
                  className="
                    border-b
                    border-slate-800
                    hover:bg-slate-800
                    transition
                  "
                >
                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          h-11
                          w-11
                          rounded-full
                          bg-cyan-600
                          flex
                          items-center
                          justify-center
                          font-bold
                          text-white
                        "
                      >
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>

                        <p className="font-semibold">
                          {user.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="text-slate-300">
                    {user.email}
                  </td>

                  <td>

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          user.role === "Admin"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : user.role === "Manager"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }
                      `}
                    >
                      {user.role ===
                      "Admin" ? (
                        <ShieldCheck size={14} />
                      ) : user.role ===
                        "Manager" ? (
                        <Shield size={14} />
                      ) : (
                        <UserCog size={14} />
                      )}

                      {user.role}

                    </span>

                  </td>

                  <td className="text-center">

                    {user.isBlocked ? (
                      <span
                        className="
                          text-red-400
                          font-semibold
                        "
                      >
                        Blocked
                      </span>
                    ) : (
                      <span
                        className="
                          text-green-400
                          font-semibold
                        "
                      >
                        Active
                      </span>
                    )}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() =>
                          onEditRole(
                            user
                          )
                        }
                        className="
                          px-3
                          py-2
                          rounded-lg
                          bg-cyan-600
                          hover:bg-cyan-700
                          transition
                        "
                      >
                        Role
                      </button>

                      <button
                        onClick={() =>
                          onBlock(
                            user._id
                          )
                        }
                        className={`
                          p-2
                          rounded-lg
                          transition
                          ${
                            user.isBlocked
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }
                        `}
                      >
                        {user.isBlocked ? (
                          <CheckCircle
                            size={18}
                          />
                        ) : (
                          <Ban
                            size={18}
                          />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          onDelete(
                            user._id
                          )
                        }
                        className="
                          p-2
                          rounded-lg
                          bg-red-600
                          hover:bg-red-700
                          transition
                        "
                      >
                        <Trash2
                          size={18}
                        />
                      </button>

                    </div>

                  </td>

                </tr>
              )
            )
          )}

        </tbody>

      </table>
    </div>
  );
}