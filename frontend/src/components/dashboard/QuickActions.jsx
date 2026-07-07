import {
  Plus,
  ClipboardList,
  UsersRound,
  Settings,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";

const actions = [
  {
    title: "Create Project",
    description: "Plan, organize and track your projects",
    icon: Plus,
    route: "/projects",
    iconColor: "text-cyan-400",
    glow: "hover:shadow-cyan-500/20",
    border: "hover:border-cyan-500/40",
  },
  {
    title: "Tasks",
    description: "Track and manage your assigned work",
    icon: ClipboardList,
    route: "/my-tasks",
    iconColor: "text-purple-400",
    glow: "hover:shadow-purple-500/20",
    border: "hover:border-purple-500/40",
  },
  {
    title: "Team",
    description: "View workspace members & roles",
    icon: UsersRound,
    route: "/team",
    iconColor: "text-green-400",
    glow: "hover:shadow-green-500/20",
    border: "hover:border-green-500/40",
  },
  {
    title: "Settings",
    description: "Configure workspace preferences",
    icon: Settings,
    route: "/settings",
    iconColor: "text-yellow-400",
    glow: "hover:shadow-yellow-500/20",
    border: "hover:border-yellow-500/40",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  const go = (route) => {
    if (!route) return;
    navigate(route);
  };

  return (
    <section className="mb-10">
      {/* HEADER */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2
  className="
    text-3xl
    font-black
    tracking-tight
    bg-gradient-to-r
    from-white
    to-slate-300
    bg-clip-text
    text-transparent
  "
>
            Quick Actions
          </h2>
          <p className="mt-2 text-base text-slate-400">
            Fast access to your most used workspace tools
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div
              key={action.title}
              onClick={() => go(action.route)}
              className={`
                group cursor-pointer
                transition-all duration-300
                hover:-translate-y-2
hover:scale-[1.02]
              `}
            >
              <Card
                className={`
                  relative overflow-hidden
                  border border border-slate-800/70
                  bg-gradient-to-br
from-slate-900/90
via-slate-900
to-slate-950
backdrop-blur-xl
                  hover:bg-slate-900
                  transition-all duration-300

                  hover:shadow-xl
                  ${action.glow}
                  ${action.border}
                `}
              >
                {/* subtle glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent" />

                {/* TOP */}

<div className="relative flex items-center justify-between">

  <div
    className={`
      h-14
      w-14
      rounded-2xl
      bg-gradient-to-br
     from-slate-800
via-slate-700
to-slate-900
shadow-lg
      flex
      items-center
      justify-center
      transition-all
      duration-300
      group-hover:scale-110
group-hover:-rotate-6
group-hover:shadow-xl
      ${action.iconColor}
    `}
  >
    <Icon size={24} />
  </div>

  <div
    className="
      opacity-0
      translate-x-3
      group-hover:opacity-100
      group-hover:translate-x-0
      transition-all
      duration-300
    "
  >
    <ArrowRight
      size={18}
      className="
text-slate-500
group-hover:text-cyan-400
transition-colors
duration-300
"
    />
  </div>

</div>

                {/* TEXT */}
                <div className="relative mt-5">
                  <h3 className="text-2xl
font-black
tracking-tight">
                    {action.title}
                  </h3>

                  <p
  className="
    mt-3
    text-sm
    leading-6
    text-slate-400
    group-hover:text-slate-300
    transition
  "
>
                    {action.description}
                  </p>
                </div>

                {/* bottom accent line */}
               <div
  className="
    absolute
    bottom-0
    left-0
    h-1
    w-0
    rounded-full
    bg-gradient-to-r
    from-cyan-500
    to-blue-500
    group-hover:w-full
group-hover:h-[5px]
    transition-all
    duration-500
  "
/>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}