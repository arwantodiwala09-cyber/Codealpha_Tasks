import {
  Search,
  FolderKanban,
  CheckSquare,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";

import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  globalSearch,
} from "../../services/searchService";

export default function GlobalSearch() {
  const navigate =
    useNavigate();

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState(null);

  useEffect(() => {
    const fetchResults =
      async () => {
        if (
          !query.trim()
        ) {
          setResults(
            null
          );
          return;
        }

        try {
          const data =
            await globalSearch(
              query
            );

          setResults(
            data
          );
        } catch (
          error
        ) {
          console.error(
            error
          );
        }
      };

    const timeout =
      setTimeout(
        fetchResults,
        300
      );

    return () =>
      clearTimeout(
        timeout
      );
  }, [query]);

  return (
    <div className="relative w-80">
      <div
        className="
          flex
          items-center
          gap-3
          bg-slate-900
          border
          border-slate-800
          px-4
          py-3
          rounded-2xl
        "
      >
        <Search
          size={18}
          className="text-slate-400"
        />

        <input
          value={query}
          onChange={(
            e
          ) =>
            setQuery(
              e.target
                .value
            )
          }
          placeholder="Search..."
          className="
            bg-transparent
            outline-none
            w-full
            text-white
          "
        />
      </div>

      {results && (
        <div
          className="
            absolute
            top-full
            mt-2
            w-full
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            max-h-96
            overflow-y-auto
            z-50
          "
        >
          {results.projects?.map(
            (
              project
            ) => (
              <button
                key={
                  project._id
                }
                onClick={() =>
                  navigate(
                    `/projects/${project._id}`
                  )
                }
                className="
                  w-full
                  text-left
                  p-3
                  hover:bg-slate-800
                  flex
                  gap-3
                "
              >
                <FolderKanban
                  size={16}
                />
                {project.name}
              </button>
            )
          )}

          {results.tasks?.map(
            (
              task
            ) => (
              <button
                key={
                  task._id
                }
                className="
                  w-full
                  text-left
                  p-3
                  hover:bg-slate-800
                  flex
                  gap-3
                "
              >
                <CheckSquare
                  size={16}
                />
                {task.title}
              </button>
            )
          )}

          {results.users?.map(
            (
              user
            ) => (
              <button
                key={
                  user._id
                }
                className="
                  w-full
                  text-left
                  p-3
                  hover:bg-slate-800
                  flex
                  gap-3
                "
              >
                <User
                  size={16}
                />
                {user.name}
              </button>
            )
          )}

          {results.files?.map(
            (
              file
            ) => (
              <button
                key={
                  file._id
                }
                className="
                  w-full
                  text-left
                  p-3
                  hover:bg-slate-800
                  flex
                  gap-3
                "
              >
                <FileText
                  size={16}
                />
                {
                  file.originalName
                }
              </button>
            )
          )}

          {results.messages?.map(
            (
              message
            ) => (
              <button
                key={
                  message._id
                }
                className="
                  w-full
                  text-left
                  p-3
                  hover:bg-slate-800
                  flex
                  gap-3
                "
              >
                <MessageSquare
                  size={16}
                />
                {message.text}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}