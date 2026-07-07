export default function EmptyState({
  icon,
  title = "Nothing Here",
  description = "There's nothing to display yet.",
  action = null,
  className = "",
}) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        text-center
        py-16
        px-6
        bg-slate-900
        border
        border-dashed
        border-slate-700
        rounded-3xl
        ${className}
      `}
    >
      {icon && (
        <div
          className="
            h-20
            w-20
            rounded-full
            bg-cyan-500/10
            text-cyan-400
            flex
            items-center
            justify-center
            mb-6
          "
        >
          {icon}
        </div>
      )}

      <h2
        className="
          text-2xl
          font-bold
          text-white
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-3
          max-w-md
          text-slate-400
          leading-7
        "
      >
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
}