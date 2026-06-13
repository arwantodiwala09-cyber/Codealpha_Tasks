export default function StatsCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-3xl
        p-6
        shadow-xl
        shadow-cyan-500/5
        hover:scale-[1.02]
        hover:border-cyan-500/30
        transition-all
        duration-300
      "
    >
      <div className="flex justify-between items-center">
        <div>
          <p
            className="
              text-sm
              font-medium
              text-slate-400
              uppercase
              tracking-wider
            "
          >
            {title}
          </p>

          <h3
            className="
              text-4xl
              font-black
              tracking-tight
              mt-2
            "
          >
            {value}
          </h3>
        </div>

        <div
          className={`
            ${color}
            p-3
            rounded-2xl
            bg-slate-800/50
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}