import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
} from "lucide-react";

import {
  useSocket,
} from "../../context/SocketContext";

import {
  getMessages,
  sendMessage,
  markProjectMessagesSeen,
} from "../../services/messageService";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatPanel({
  projectId,
}) {
  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const { socket } =
    useSocket();

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    text,
    setText,
  ] = useState("");

  const [
    typingUser,
    setTypingUser,
  ] = useState("");

  const messagesEndRef =
    useRef(null);

  const scrollBottom =
    () => {
      messagesEndRef.current?.scrollIntoView(
        {
          behavior:
            "smooth",
        }
      );
    };

  useEffect(() => {
    async function loadMessages() {
      try {
        const data =
          await getMessages(
            projectId
          );

        setMessages(
          data
        );

        await markProjectMessagesSeen(
          projectId
        );
      } catch (error) {
        console.error(
          error
        );
      }
    }

    loadMessages();

    socket.emit(
      "joinProject",
      projectId
    );

    const handleNewMessage =
      (
        message
      ) => {
        const messageProjectId =
          typeof message.project ===
          "object"
            ? message.project._id
            : message.project;

        if (
          messageProjectId ===
          projectId
        ) {
          setMessages(
            (prev) => {
              const exists =
                prev.some(
                  (
                    m
                  ) =>
                    m._id ===
                    message._id
                );

              if (
                exists
              ) {
                return prev;
              }

              return [
                ...prev,
                message,
              ];
            }
          );
        }
      };

    const handleReactionUpdate =
      (
        updatedMessage
      ) => {
        setMessages(
          (prev) =>
            prev.map(
              (
                message
              ) =>
                message._id ===
                updatedMessage._id
                  ? updatedMessage
                  : message
            )
        );
      };

    const handleMessageEdited =
      (
        updatedMessage
      ) => {
        setMessages(
          (prev) =>
            prev.map(
              (
                message
              ) =>
                message._id ===
                updatedMessage._id
                  ? updatedMessage
                  : message
            )
        );
      };

    const handleMessageDeleted =
      (
        updatedMessage
      ) => {
        setMessages(
          (prev) =>
            prev.map(
              (
                message
              ) =>
                message._id ===
                updatedMessage._id
                  ? updatedMessage
                  : message
            )
        );
      };

    const handleMessageSeen =
      ({
        messageId,
        userId,
      }) => {
        setMessages(
          (prev) =>
            prev.map(
              (
                message
              ) => {
                if (
                  message._id !==
                  messageId
                ) {
                  return message;
                }

                const alreadySeen =
                  message.seenBy?.some(
                    (
                      entry
                    ) =>
                      entry.user ===
                      userId
                  );

                if (
                  alreadySeen
                ) {
                  return message;
                }

                return {
                  ...message,
                  seenBy: [
                    ...(message.seenBy ||
                      []),
                    {
                      user:
                        userId,
                      seenAt:
                        new Date(),
                    },
                  ],
                };
              }
            )
        );
      };

    const handleTyping =
      (
        payload
      ) => {
        setTypingUser(
          payload.name
        );
      };

    const handleStopTyping =
      () => {
        setTypingUser(
          ""
        );
      };

    socket.on(
      "newMessage",
      handleNewMessage
    );

    socket.on(
      "messageReactionUpdated",
      handleReactionUpdate
    );

    socket.on(
      "messageEdited",
      handleMessageEdited
    );

    socket.on(
      "messageDeleted",
      handleMessageDeleted
    );

    socket.on(
      "messageSeen",
      handleMessageSeen
    );

    socket.on(
      "typing",
      handleTyping
    );

    socket.on(
      "stopTyping",
      handleStopTyping
    );

    return () => {
      socket.off(
        "newMessage",
        handleNewMessage
      );

      socket.off(
        "messageReactionUpdated",
        handleReactionUpdate
      );

      socket.off(
        "messageEdited",
        handleMessageEdited
      );

      socket.off(
        "messageDeleted",
        handleMessageDeleted
      );

      socket.off(
        "messageSeen",
        handleMessageSeen
      );

      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "stopTyping",
        handleStopTyping
      );
    };
  }, [
    projectId,
    socket,
  ]);

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  const handleSend =
    async () => {
      if (
        !text.trim()
      ) {
        return;
      }

      try {
        const message =
          await sendMessage(
            projectId,
            text
          );

        socket.emit(
          "sendMessage",
          message
        );

        setText("");

        socket.emit(
          "stopTyping",
          {
            projectId,
          }
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const handleTypingInput =
    (
      value
    ) => {
      setText(value);

      socket.emit(
        "typing",
        {
          projectId,
          name:
            currentUser.name,
        }
      );

      clearTimeout(
        window.typingTimeout
      );

      window.typingTimeout =
        setTimeout(
          () => {
            socket.emit(
              "stopTyping",
              {
                projectId,
              }
            );
          },
          1000
        );
    };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl h-175 flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <h2 className="text-2xl font-bold">
          Project Chat
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map(
          (
            message
          ) => (
            <MessageBubble
              key={
                message._id
              }
              message={
                message
              }
              currentUserId={
                currentUser._id
              }
            />
          )
        )}

        <TypingIndicator
          typingUser={
            typingUser
          }
        />

        <div
          ref={
            messagesEndRef
          }
        />
      </div>

      <div className="border-t border-slate-800 p-4 flex gap-3">
        <input
          value={text}
          onChange={(
            e
          ) =>
            handleTypingInput(
              e.target
                .value
            )
          }
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3"
        />

        <button
          onClick={
            handleSend
          }
          className="bg-cyan-500 hover:bg-cyan-600 px-5 rounded-xl"
        >
          <Send
            size={18}
          />
        </button>
      </div>
    </div>
  );
}