import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  MessageSquare,
  Send,
  Trash2,
  X,
  Paperclip,
} from "lucide-react";

import {
  getCommentsByTask,
  createComment,
  deleteComment,
} from "../../services/commentService";

import {
  useSocket,
} from "../../context/SocketContext";

export default function TaskCommentsModal({
  isOpen,
  onClose,
  task,
}) {
  const { socket } = useSocket();

  const [comments, setComments] =
    useState([]);

  const [text, setText] =
    useState("");

  const [files, setFiles] =
    useState([]);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const loadComments =
    useCallback(async () => {
      if (!task) return;

      try {
        const data =
          await getCommentsByTask(
            task._id
          );

        setComments(data);
      } catch (error) {
        console.error(error);
      }
    }, [task]);

  useEffect(() => {
    if (!isOpen || !task) return;

    loadComments();
  }, [
    isOpen,
    task,
    loadComments,
  ]);

  useEffect(() => {
    if (!socket || !task) return;

    const handleNewComment = (
      comment
    ) => {
      if (
        comment.task === task._id ||
        comment.task?._id ===
          task._id
      ) {
        setComments((prev) => {
          const exists =
            prev.some(
              (c) =>
                c._id ===
                comment._id
            );

          if (exists) {
            return prev;
          }

          return [
            comment,
            ...prev,
          ];
        });
      }
    };

    const handleDeleteCommentSocket =
      ({ commentId }) => {
        setComments((prev) =>
          prev.filter(
            (comment) =>
              comment._id !==
              commentId
          )
        );
      };

    socket.on(
      "newComment",
      handleNewComment
    );

    socket.on(
      "commentDeleted",
      handleDeleteCommentSocket
    );

    return () => {
      socket.off(
        "newComment",
        handleNewComment
      );

      socket.off(
        "commentDeleted",
        handleDeleteCommentSocket
      );
    };
  }, [
    socket,
    task,
  ]);
    const handleAddComment =
    async () => {
      if (
        !task ||
        (!text.trim() &&
          files.length === 0)
      ) {
        return;
      }

      try {
        await createComment(
          task._id,
          text,
          files
        );

        setText("");
        setFiles([]);

        await loadComments();
      } catch (error) {
        console.error(error);
      }
    };

  const handleDeleteComment =
    async (
      commentId
    ) => {
      try {
        await deleteComment(
          commentId
        );

        setComments((prev) =>
          prev.filter(
            (comment) =>
              comment._id !==
              commentId
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

  const isImage =
    (fileType) => {
      return (
        fileType &&
        fileType.startsWith(
          "image/"
        )
      );
    };

  const formatComment =
    (text) => {
      if (!text) {
        return null;
      }

      return text
        .split(
          /(@[a-zA-Z0-9_]+)/g
        )
        .map(
          (
            part,
            index
          ) => {
            if (
              part.startsWith(
                "@"
              )
            ) {
              return (
                <span
                  key={index}
                  className="
                    text-cyan-400
                    font-semibold
                  "
                >
                  {part}
                </span>
              );
            }

            return (
              <span key={index}>
                {part}
              </span>
            );
          }
        );
    };

  if (!task) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-3xl
              w-full
              max-w-3xl
              p-6
              max-h-[85vh]
              overflow-hidden
            "
          >
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Comments
              </h2>

              <button
                onClick={onClose}
                className="
                  text-slate-400
                  hover:text-white
                "
              >
                <X />
              </button>

            </div>

            <div className="space-y-3 mb-6">

              <div className="flex gap-3">

                <input
                  value={text}
                  onChange={(e) =>
                    setText(
                      e.target.value
                    )
                  }
                  placeholder="Write a comment..."
                  className="
                    flex-1
                    bg-slate-800
                    border
                    border-slate-700
                    rounded-xl
                    px-4
                    py-3
                  "
                />

                <label
                  className="
                    bg-slate-800
                    border
                    border-slate-700
                    px-4
                    rounded-xl
                    flex
                    items-center
                    cursor-pointer
                    hover:bg-slate-700
                  "
                >
                  <Paperclip
                    size={18}
                  />

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) =>
                      setFiles(
                        Array.from(
                          e.target.files
                        )
                      )
                    }
                  />
                </label>

                <button
                  onClick={
                    handleAddComment
                  }
                  className="
                    bg-cyan-500
                    hover:bg-cyan-600
                    px-5
                    rounded-xl
                  "
                >
                  <Send
                    size={18}
                  />
                </button>

              </div>
                            {files.length > 0 && (
                <div className="bg-slate-800 rounded-xl p-3">

                  <p className="text-sm text-cyan-400 mb-2">
                    Selected Files
                  </p>

                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="text-sm text-slate-300"
                    >
                      • {file.name}
                    </div>
                  ))}

                </div>
              )}

            </div>

            <div
              className="
                space-y-4
                overflow-y-auto
                max-h-[55vh]
              "
            >

              {comments.map((comment) => (

                <div
                  key={comment._id}
                  className="
                    bg-slate-800
                    rounded-xl
                    p-4
                  "
                >

                  <div className="flex justify-between">

                    <div className="flex-1">

                      <h4 className="font-semibold">
                        {comment.user?.name}
                      </h4>

                      {comment.text && (
                        <p className="text-slate-300 mt-2">
                          {formatComment(
                            comment.text
                          )}
                        </p>
                      )}

                      {comment.attachments?.length > 0 && (

                        <div className="mt-4 space-y-3">

                          {comment.attachments.map(
                            (file, index) => (

                              <div key={index}>

                                {isImage(file.fileType) ? (

                                  <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={file.fileUrl}
                                      alt={file.fileName}
                                      className="
                                        max-h-48
                                        rounded-xl
                                        border
                                        border-slate-700
                                      "
                                    />
                                  </a>

                                ) : (

                                  <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                      text-cyan-400
                                      hover:text-cyan-300
                                      underline
                                      block
                                    "
                                  >
                                    {file.fileName}
                                  </a>

                                )}

                              </div>

                            )
                          )}

                        </div>

                      )}

                      <p className="text-xs text-slate-500 mt-3">
                        {new Date(
                          comment.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    {(currentUser?._id ===
                      comment.user?._id ||
                      currentUser?.role === "Admin") && (

                      <button
                        onClick={() =>
                          handleDeleteComment(
                            comment._id
                          )
                        }
                        className="
                          text-red-400
                          ml-4
                          hover:text-red-300
                        "
                      >
                        <Trash2 size={16} />
                      </button>

                    )}

                  </div>

                </div>

              ))}
                            {comments.length === 0 && (
                <div
                  className="
                    text-center
                    text-slate-500
                    py-10
                  "
                >
                  No comments yet
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </>
  );
}