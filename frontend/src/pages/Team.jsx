import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Users,
  Shield,
} from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import Navbar from "../components/Navbar";

import {
  getAllUsers,
} from "../services/teamService";

import {
  updateUserRole,
} from "../services/userService";

export default function Team() {
  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const loadUsers =
    async () => {
      try {
        const data =
          await getAllUsers();

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange =
    async (
      userId,
      role
    ) => {
      try {
        await updateUserRole(
          userId,
          role
        );

        await loadUsers();

        alert(
          "Role Updated Successfully"
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed To Update Role"
        );
      }
    };

  const filteredUsers =
    users.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        user.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <DashboardLayout>
      <Navbar />

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Team Directory
        </h1>

        <p className="text-slate-400 mt-2">
          Manage and browse all users
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-3">
          <Search
            size={20}
            className="text-slate-500"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              bg-transparent
              outline-none
              w-full
            "
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          Loading Users...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map(
            (user) => (
              <div
                key={user._id}
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-3xl
                  p-6
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      h-14
                      w-14
                      rounded-full
                      bg-linear-to-r
                      from-cyan-500
                      to-blue-600
                      flex
                      items-center
                      justify-center
                      text-lg
                      font-bold
                    "
                  >
                    {user.name.charAt(
                      0
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {user.name}
                    </h3>

                    <p className="text-slate-400 text-sm">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-cyan-400">
                  <Users size={16} />
                  {user.role}
                </div>

                {currentUser?.role ===
                  "Admin" &&
                  currentUser?._id !==
                    user._id && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2 mb-2 text-yellow-400">
                        <Shield size={16} />
                        Change Role
                      </div>

                      <select
                        value={
                          user.role
                        }
                        onChange={(
                          e
                        ) =>
                          handleRoleChange(
                            user._id,
                            e.target
                              .value
                          )
                        }
                        className="
                          w-full
                          bg-slate-800
                          border
                          border-slate-700
                          rounded-xl
                          p-3
                        "
                      >
                        <option value="Member">
                          Member
                        </option>

                        <option value="Manager">
                          Manager
                        </option>

                        <option value="Admin">
                          Admin
                        </option>
                      </select>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      )}
    </DashboardLayout>
  );
}