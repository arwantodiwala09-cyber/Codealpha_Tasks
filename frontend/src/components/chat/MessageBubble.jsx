import {
  useState,
} from "react";

import {
  Edit2,
  Trash2,
} from "lucide-react";

import {
  addReaction,
  editMessage,
  deleteMessage,
} from "../../services/messageService";

export default function MessageBubble({
  message,
  currentUserId,
}) {
  const isMine =
    message.sender?._id ===
    currentUserId;

  const currentUser =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    editText,
    setEditText,
  ] = useState(
    message.text
  );

  const emojis = [
    "👍",
    "❤️",
    "🔥",
    "😂",
  ];

  const handleReaction =
    async (
      emoji
    ) => {
      try {
        await addReaction(
          message._id,
          emoji
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  const handleEdit =
    async () => {
      try {
        await editMessage(
          message._id,
          editText
        );

        setIsEditing(
          false
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  const handleDelete =
    async () => {
      const confirmDelete =
        window.confirm(
          "Delete this message?"
        );

      if (
        !confirmDelete
      ) {
        return;
      }

      try {
        await deleteMessage(
          message._id
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  const getReactionCount =
    (
      emoji
    ) => {
      return (
        message.reactions?.filter(
          (
            reaction
          ) =>
            reaction.emoji ===
            emoji
        ).length || 0
      );
    };

  const hasReacted =
    (
      emoji
    ) => {
      return (
        message.reactions?.some(
          (
            reaction
          ) =>
            reaction.emoji ===
              emoji &&
            reaction.user?._id ===
              currentUserId
        ) || false
      );
    };

  const canDelete =
    isMine ||
    currentUser?.role ===
      "Admin";

  return (
    <div
      className={`flex ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[75%]
          rounded-2xl
          px-4
          py-3
          ${
            isMine
              ? "bg-cyan-500 text-white"
              : "bg-slate-800 text-white"
          }
        `}
      >
        {!isMine && (
          <p className="text-xs text-cyan-400 mb-1">
            {
              message.sender
                ?.name
            }
          </p>
        )}

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  value={
                    editText
                  }
                  onChange={(
                    e
                  ) =>
                    setEditText(
                      e.target
                        .value
                    )
                  }
                  className="
                    w-full
                    bg-slate-700
                    rounded-lg
                    px-3
                    py-2
                  "
                />

                <button
                  onClick={
                    handleEdit
                  }
                  className="
                    bg-green-500
                    px-3
                    py-1
                    rounded-lg
                    text-sm
                  "
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <p className="wrap-break-word">
                  {message.text
                    .split(" ")
                    .map(
                      (
                        word,
                        index
                      ) => {
                        const isMention =
                          word.startsWith(
                            "@"
                          );

                        return isMention ? (
                          <span
                            key={
                              index
                            }
                            className="
                              bg-yellow-500/20
                              text-yellow-300
                              px-2
                              py-1
                              rounded-md
                              font-semibold
                              mr-1
                            "
                          >
                            {
                              word
                            }
                          </span>
                        ) : (
                          <span
                            key={
                              index
                            }
                          >
                            {
                              word
                            }{" "}
                          </span>
                        );
                      }
                    )}
                </p>

                {message.isEdited &&
                  !message.isDeleted && (
                    <p className="text-[10px] italic opacity-70 mt-1">
                      (edited)
                    </p>
                  )}

                {message.isDeleted && (
                  <p className="italic text-red-300">
                    This message was deleted
                  </p>
                )}
              </>
            )}
          </div>

          {!message.isDeleted && (
            <div className="flex gap-2">
              {isMine && (
                <button
                  onClick={() =>
                    setIsEditing(
                      true
                    )
                  }
                >
                  <Edit2
                    size={14}
                  />
                </button>
              )}

              {canDelete && (
                <button
                  onClick={
                    handleDelete
                  }
                >
                  <Trash2
                    size={14}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {!message.isDeleted && (
          <div className="flex flex-wrap gap-2 mt-4">
            {emojis.map(
              (
                emoji
              ) => (
                <button
                  key={
                    emoji
                  }
                  onClick={() =>
                    handleReaction(
                      emoji
                    )
                  }
                  className={`
                    px-2
                    py-1
                    rounded-lg
                    text-sm
                    ${
                      hasReacted(
                        emoji
                      )
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 hover:bg-slate-600"
                    }
                  `}
                >
                  {emoji}{" "}
                  {getReactionCount(
                    emoji
                  )}
                </button>
              )
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <p className="text-[10px] opacity-70">
            {new Date(
              message.createdAt
            ).toLocaleTimeString()}
          </p>

          {isMine && (
            <p className="text-[10px] opacity-80">
              {message.seenBy &&
              message.seenBy.length >
                0
                ? "✓✓ Seen"
                : "✓ Sent"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}