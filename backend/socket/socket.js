let io;

const onlineUsers =
  new Map();

const initSocket = (
  socketIo
) => {
  io = socketIo;

  io.on(
    "connection",
    (socket) => {
      console.log(
        "⚡ User Connected:",
        socket.id
      );

      // USER ONLINE
      socket.on(
        "userOnline",
        (userId) => {
          socket.userId =
            userId;

          if (
            !onlineUsers.has(
              userId
            )
          ) {
            onlineUsers.set(
              userId,
              new Set()
            );
          }

          onlineUsers
            .get(userId)
            .add(
              socket.id
            );

          io.emit(
            "onlineUsers",
            Array.from(
              onlineUsers.keys()
            )
          );
        }
      );

      // JOIN PROJECT
      socket.on(
        "joinProject",
        (
          projectId
        ) => {
          socket.join(
            projectId
          );

          socket.projectId =
            projectId;

          io.to(
            projectId
          ).emit(
            "projectMemberJoined",
            {
              userId:
                socket.userId,
            }
          );

          console.log(
            `📁 Joined Project: ${projectId}`
          );
        }
      );

      // CHAT MESSAGE
      socket.on(
        "sendMessage",
        (
          message
        ) => {
          io.to(
            typeof message.project ===
              "object"
              ? message.project._id
              : message.project
          ).emit(
            "newMessage",
            message
          );
        }
      );

      // MESSAGE REACTION
      socket.on(
        "messageReactionUpdated",
        (
          message
        ) => {
          io.to(
            typeof message.project ===
              "object"
              ? message.project._id
              : message.project
          ).emit(
            "messageReactionUpdated",
            message
          );
        }
      );

      // TYPING
      socket.on(
        "typing",
        (
          payload
        ) => {
          socket
            .to(
              payload.projectId
            )
            .emit(
              "typing",
              payload
            );
        }
      );

      socket.on(
        "stopTyping",
        (
          payload
        ) => {
          socket
            .to(
              payload.projectId
            )
            .emit(
              "stopTyping",
              payload
            );
        }
      );

      // ONLINE USERS
      socket.on(
        "getOnlineUsers",
        () => {
          socket.emit(
            "onlineUsers",
            Array.from(
              onlineUsers.keys()
            )
          );
        }
      );

      // DISCONNECT
      socket.on(
        "disconnect",
        () => {
          const userId =
            socket.userId;

          if (
            userId &&
            onlineUsers.has(
              userId
            )
          ) {
            const userSockets =
              onlineUsers.get(
                userId
              );

            userSockets.delete(
              socket.id
            );

            if (
              userSockets.size ===
              0
            ) {
              onlineUsers.delete(
                userId
              );
            }
          }

          io.emit(
            "onlineUsers",
            Array.from(
              onlineUsers.keys()
            )
          );

          console.log(
            `❌ User Disconnected: ${socket.id}`
          );
        }
      );
    }
  );
};

const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io not initialized"
    );
  }

  return io;
};

const getOnlineUsers =
  () => {
    return Array.from(
      onlineUsers.keys()
    );
  };

module.exports = {
  initSocket,
  getIO,
  getOnlineUsers,
};