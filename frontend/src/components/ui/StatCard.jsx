import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle = "",
  icon,
  color = "text-cyan-400",
  trend = null,
  className = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
       bg-gradient-to-br
from-slate-900
to-slate-950
backdrop-blur-xl
        border-slate-800
        rounded-3xl
        p-6
        transition-all
        duration-300
        hover:border-cyan-500/40
        hover:-translate-y-1
        hover:shadow-xl
        hover:shadow-cyan-500/10
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">

        <div className="flex-1">

          <p
            className="
              text-sm
              text-slate-400
              font-medium
            "
          >
            {title}
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              tracking-tight
              text-white
            "
          >
            {value}
          </h2>

          {subtitle && (
            <p
              className="
                mt-2
                text-sm
                text-slate-500
              "
            >
              {subtitle}
            </p>
          )}

          {trend !== null && (
            <div
              className={`
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${
                  trend >= 0
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }
              `}
            >
              <TrendingUp
                size={14}
                className={
                  trend < 0
                    ? "rotate-180"
                    : ""
                }
              />

              {trend > 0 && "+"}

              {trend}%
            </div>
          )}

        </div>

        <div
          className={`
            h-16
            w-16
            rounded-2xl
            bg-slate-800
            flex
            items-center
            justify-center
            ${color}
          `}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}