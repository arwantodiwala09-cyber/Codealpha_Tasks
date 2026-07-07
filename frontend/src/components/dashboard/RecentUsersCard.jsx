import {
  Users,
  ArrowRight,
  Shield,
  Briefcase,
  User,
} from "lucide-react";

import Card from "../ui/Card";

export default function RecentUsersCard({
  users = [],
}) {
  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return {
          color:
            "text-red-400",
          bg:
            "bg-red-500/10",
          icon:
            <Shield size={12} />,
        };

      case "Manager":
        return {
          color:
            "text-green-400",
          bg:
            "bg-green-500/10",
          icon:
            <Briefcase size={12} />,
        };

      default:
        return {
          color:
            "text-cyan-400",
          bg:
            "bg-cyan-500/10",
          icon:
            <User size={12} />,
        };
    }
  };

  return (
    <Card
      className="
        relative
        overflow-hidden
        border
        border-slate-800
        bg-gradient-to-br
        from-slate-900
        via-slate-900
        to-slate-950
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:shadow-2xl
        hover:shadow-cyan-500/10
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-12
          -top-12
          h-44
          w-44
          rounded-full
          bg-cyan-500/10
          blur-3xl
        "
      />

      {/* Header */}

      <div className="relative flex items-center justify-between mb-8">

        <div>

          <div className="flex items-center gap-3">

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-cyan-500/10
                flex
                items-center
                justify-center
              "
            >
              <Users
                size={22}
                className="text-cyan-400"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Recent Users
              </h2>

              <p className="text-sm text-slate-400">
                Newly joined workspace members
              </p>

            </div>

          </div>

        </div>

        <button
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-cyan-400
            hover:text-cyan-300
            transition
          "
        >
          View All

          <ArrowRight size={15} />

        </button>

      </div>

      {users.length === 0 ? (

        <div
          className="
            h-60
            rounded-3xl
            border-2
            border-dashed
            border-slate-700
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <Users
            size={42}
            className="text-slate-600 mb-4"
          />

          <p className="text-slate-500">
            No users found
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {users
            .slice(0, 4)
            .map((user) => {

              const role =
                getRoleStyle(
                  user.role
                );

              return (

                <div
                  key={user._id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-900/60
                    p-5
                    transition-all
                    duration-300
                    hover:border-cyan-500/40
                    hover:bg-slate-900
                    hover:-translate-y-1
                  "
                >

                  <div
                    className="
                      absolute
                      inset-y-0
                      left-0
                      w-1
                      bg-cyan-500
                      scale-y-0
                      origin-top
                      transition-transform
                      duration-300
                      group-hover:scale-y-100
                    "
                  />

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div
                        className="
                          relative
                          h-12
                          w-12
                          rounded-full
                          bg-gradient-to-br
                          from-cyan-500
                          to-blue-600
                          flex
                          items-center
                          justify-center
                          font-bold
                          text-white
                          shadow-lg
                          shadow-cyan-500/20
                        "
                      >
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase()}

                        <span
                          className="
                            absolute
                            bottom-0
                            right-0
                            h-3
                            w-3
                            rounded-full
                            bg-green-500
                            border-2
                            border-slate-900
                          "
                        />

                      </div>

                      <div>

                        <h3 className="font-semibold">
                          {user.name}
                        </h3>

                        <p className="text-sm text-slate-400">
                          {user.email}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        ${role.bg}
                        ${role.color}
                      `}
                    >
                      {role.icon}

                      {user.role}

                    </span>

                  </div>

                </div>

              );

            })}

        </div>

      )}

    </Card>
  );
}