import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
