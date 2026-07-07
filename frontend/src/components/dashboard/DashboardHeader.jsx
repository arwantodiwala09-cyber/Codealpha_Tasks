import { User } from "lucide-react";

export default function DashboardHeader({ user }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-cyan-600 via-blue-700 to-indigo-700 p-8 mb-8 shadow-xl">
      {/* Background Blur */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20">
            <User size={38} className="text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.name}
            </h1>

            <p className="mt-1 text-cyan-100">
              {user?.email}
            </p>

            <div className="mt-4 inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/20">
              {user?.role}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-6 py-5">
          <p className="text-sm text-cyan-100">
            Workspace Overview
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Have a productive day 🚀
          </h2>

          <p className="mt-2 text-sm text-cyan-100">
            Stay on top of projects, tasks, and your team's progress.
          </p>
        </div>
      </div>
    </section>
  );
}