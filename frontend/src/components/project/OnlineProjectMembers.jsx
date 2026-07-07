import { Users } from "lucide-react";
import { useSocket } from "../../context/SocketContext";

export default function OnlineProjectMembers({
  members = [],
}) {
  const { onlineUsers } =
    useSocket();

  const onlineMembers =
    members.filter((member) =>
      onlineUsers.includes(
        member._id
      )
    );

  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-8
        mb-8
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users
            size={24}
            className="text-cyan-400"
          />

          <h2 className="text-2xl font-bold">
            Online Members
          </h2>
        </div>

        <div
          className="
            bg-green-500/10
            text-green-400
            px-4
            py-2
            rounded-full
            text-sm
            font-medium
          "
        >
          {onlineMembers.length} Online
        </div>
      </div>

      <div className="space-y-3">
        {members.map((member) => {
          const isOnline =
            onlineUsers.includes(
              member._id
            );

          return (
            <div
              key={member._id}
              className="
                bg-slate-800
                border
                border-slate-700
                rounded-2xl
                p-4
                flex
                items-center
                justify-between
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
                <div
                  className={`
                    h-3
                    w-3
                    rounded-full
                    ${
                      isOnline
                        ? "bg-green-500"
                        : "bg-slate-500"
                    }
                  `}
                />

                <span
                  className={
                    isOnline
                      ? "text-green-400"
                      : "text-slate-400"
                  }
                >
                  {isOnline
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}