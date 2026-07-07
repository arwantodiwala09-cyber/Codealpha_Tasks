export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  className = "",
  bodyClassName = "",
  hover = true,
  padding = true,
}) {
  return (
    <div
      className={`
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        shadow-lg
        transition-all
        duration-300
        ${
          hover
            ? "hover:border-cyan-500/40 hover:shadow-cyan-500/10 hover:-translate-y-1"
            : ""
        }
        ${className}
      `}
    >
      {(title ||
        subtitle ||
        headerAction) && (
        <div
          className={`
            flex
            justify-between
            items-start
            border-b
            border-slate-800
            ${
              padding
                ? "p-6"
                : "px-6 py-4"
            }
          `}
        >
          <div>
            {title && (
              <h2
                className="
                  text-xl
                  font-bold
                  text-white
                "
              >
                {title}
              </h2>
            )}

            {subtitle && (
              <p
                className="
                  mt-1
                  text-sm
                  text-slate-400
                "
              >
                {subtitle}
              </p>
            )}
          </div>

          {headerAction && (
            <div>
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div
        className={`
          ${
            padding
              ? "p-6"
              : ""
          }
          ${bodyClassName}
        `}
      >
        {children}
      </div>
    </div>
  );
}