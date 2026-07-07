import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-cyan-600 hover:bg-cyan-700 text-white",

    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    outline:
      "border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10",

    ghost:
      "hover:bg-slate-800 text-slate-300",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-5 py-3",

    lg: "px-7 py-4 text-lg",
  };

  return (
    <button
      type={type}
      disabled={
        disabled || loading
      }
      onClick={onClick}
      className={`
        rounded-xl
        font-semibold
        transition-all
        duration-300
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading && (
        <Loader2
          size={18}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}