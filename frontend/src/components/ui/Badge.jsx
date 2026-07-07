export default function Badge({
  children,
  variant = "default",
  size = "md",
  rounded = true,
  className = "",
}) {
  const variants = {
    default:
      "bg-slate-700 text-slate-200 border border-slate-600",

    primary:
      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",

    success:
      "bg-green-500/10 text-green-400 border border-green-500/20",

    danger:
      "bg-red-500/10 text-red-400 border border-red-500/20",

    warning:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

    purple:
      "bg-purple-500/10 text-purple-400 border border-purple-500/20",

    admin:
      "bg-red-600/10 text-red-400 border border-red-600/30",

    manager:
      "bg-yellow-600/10 text-yellow-400 border border-yellow-600/30",

    member:
      "bg-cyan-600/10 text-cyan-400 border border-cyan-600/30",

    todo:
      "bg-slate-600/20 text-slate-300 border border-slate-600/30",

    progress:
      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",

    review:
      "bg-purple-500/10 text-purple-400 border border-purple-500/20",

    done:
      "bg-green-500/10 text-green-400 border border-green-500/20",

    high:
      "bg-red-500/10 text-red-400 border border-red-500/20",

    medium:
      "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

    low:
      "bg-green-500/10 text-green-400 border border-green-500/20",
  };

  const sizes = {
    sm:
      "px-2 py-1 text-xs",

    md:
      "px-3 py-1 text-sm",

    lg:
      "px-4 py-2 text-base",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        font-semibold
        whitespace-nowrap
        transition-all
        duration-300

        ${
          rounded
            ? "rounded-full"
            : "rounded-lg"
        }

        ${sizes[size]}

        ${variants[variant]}

        ${className}
      `}
    >
      {children}
    </span>
  );
}