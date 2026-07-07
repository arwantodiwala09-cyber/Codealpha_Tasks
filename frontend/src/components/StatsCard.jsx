export default function StatCard({
  title,
  value,
  icon,
  color,
}) {
  const colors = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "hover:border-cyan-500/40",
      shadow: "hover:shadow-cyan-500/20",
      accent: "from-cyan-500 to-sky-500",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/40",
      shadow: "hover:shadow-purple-500/20",
      accent: "from-purple-500 to-pink-500",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-500/40",
      shadow: "hover:shadow-emerald-500/20",
      accent: "from-emerald-500 to-green-500",
    },
    yellow: {
      bg: "bg-yellow-500/10",
      border: "hover:border-yellow-500/40",
      shadow: "hover:shadow-yellow-500/20",
      accent: "from-yellow-500 to-orange-500",
    },
    red: {
      bg: "bg-red-500/10",
      border: "hover:border-red-500/40",
      shadow: "hover:shadow-red-500/20",
      accent: "from-red-500 to-rose-500",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/40",
      shadow: "hover:shadow-blue-500/20",
      accent: "from-blue-500 to-indigo-500",
    },
    green: {
      bg: "bg-green-500/10",
      border: "hover:border-green-500/40",
      shadow: "hover:shadow-green-500/20",
      accent: "from-green-500 to-emerald-500",
    },
  };

  const theme = colors[color] || colors.cyan;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-800/70
        bg-gradient-to-br
        from-slate-900/90
        via-slate-900
        to-slate-950
        backdrop-blur-xl
        p-7
        transition-all
        duration-300
        hover:-translate-y-2
        hover:scale-[1.02]
        hover:shadow-2xl
        ${theme.border}
        ${theme.shadow}
      `}
    >
      {/* Glow */}
      <div
        className={`
          absolute
          -right-10
          -top-10
          h-36
          w-36
          rounded-full
          bg-gradient-to-br
          ${theme.accent}
          opacity-10
          blur-3xl
          transition-all
          duration-500
          group-hover:opacity-20
        `}
      />

      {/* Accent Line */}
      <div
        className={`
          absolute
          left-0
          top-0
          h-1
          w-full
          bg-gradient-to-r
          ${theme.accent}
        `}
      />

      <div className="relative flex items-start justify-between">

        <div>

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-slate-500
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-4
              text-5xl
              font-black
              tracking-tight
              leading-none
            "
          >
            {value}
          </h3>

        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${theme.bg}
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:-rotate-6
            shadow-lg
          `}
        >
          {icon}
        </div>

      </div>

      <div className="mt-8 flex items-center justify-between">

        <span className="text-sm text-slate-500">
          Live Workspace Data
        </span>

        <div
          className={`
            h-2
            w-2
            rounded-full
            bg-gradient-to-r
            ${theme.accent}
            animate-pulse
          `}
        />

      </div>

    </div>
  );
}