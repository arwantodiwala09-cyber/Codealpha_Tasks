import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import socket from "../socket/socket";

const SocketContext =
  createContext();

export function SocketProvider({
  children,
}) {
  const [
    onlineUsers,
    setOnlineUsers,
  ] = useState([]);

 useEffect(() => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleConnect = () => {
    console.log(
      "⚡ Connected:",
      socket.id
    );

    if (user?._id) {
      socket.emit(
        "userOnline",
        user._id
      );

      socket.emit(
        "getOnlineUsers"
      );
    }
  };

  const handleOnlineUsers = (
    users
  ) => {
    setOnlineUsers(users);
  };

  socket.on(
    "connect",
    handleConnect
  );

  socket.on(
    "onlineUsers",
    handleOnlineUsers
  );

  // IMPORTANT
  if (socket.connected) {
    handleConnect();
  }

  return () => {
    socket.off(
      "connect",
      handleConnect
    );

    socket.off(
      "onlineUsers",
      handleOnlineUsers
    );
  };
}, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket =
  () => {
    return useContext(
      SocketContext
    );
  };