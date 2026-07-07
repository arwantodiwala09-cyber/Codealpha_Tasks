import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import DashboardLayout from "../layout/DashboardLayout";
import Navbar from "../components/Navbar";
import StatCard from "../components/ui/StatCard";

import CalendarView from "../components/calendar/CalendarView";
import UpcomingDeadlines from "../components/calendar/UpcomingDeadlines";

import {
  getTasks,
} from "../services/taskService";

export default function Calendar() {
  const [
    tasks,
    setTasks,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadTasks();
  }, []);

  const loadTasks =
    async () => {
      try {
        const data =
          await getTasks();

        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
const metrics = useMemo(() => {

  const completed =
    tasks.filter(
      t => t.status === "done"
    ).length;

  const pending =
    tasks.filter(
      t => t.status !== "done"
    ).length;

  const overdue =
    tasks.filter(
      t =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "done"
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed /
            tasks.length) *
            100
        );

  return {
    completed,
    pending,
    overdue,
    progress,
  };

}, [tasks]);
  return (

<DashboardLayout>

<Navbar />

<div className="p-8">

{/* HERO */}

<div
className="
relative
overflow-hidden
bg-gradient-to-r
from-slate-900
via-slate-900
to-slate-800
border
border-slate-800
rounded-3xl
p-10
mb-8
"
>

<div
className="
absolute
top-0
right-0
h-60
w-60
rounded-full
bg-cyan-500/10
blur-3xl
"
/>

<div className="relative flex justify-between items-center">

<div className="flex items-center gap-6">

<div
className="
h-20
w-20
rounded-3xl
bg-gradient-to-br
from-cyan-500
to-blue-600
flex
items-center
justify-center
shadow-xl
shadow-cyan-500/20
"
>

<CalendarDays size={38} />

</div>

<div>

<p className="text-cyan-400 font-medium">
Schedule Manager
</p>

<h1 className="text-5xl font-black">
Calendar
</h1>

<p className="text-slate-400 mt-3 max-w-2xl">
Manage deadlines, monitor upcoming milestones, and keep every project on schedule with a single unified calendar.
</p>

<div className="flex flex-wrap gap-4 mt-6">

  <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3">
    <p className="text-xs text-slate-400">
      Total Tasks
    </p>
    <h3 className="text-2xl font-bold">
      {tasks.length}
    </h3>
  </div>

  <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3">
    <p className="text-xs text-slate-400">
      Completed
    </p>
    <h3 className="text-2xl font-bold text-green-400">
      {metrics.completed}
    </h3>
  </div>

  <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-5 py-3">
    <p className="text-xs text-slate-400">
      Pending
    </p>
    <h3 className="text-2xl font-bold text-yellow-400">
      {metrics.pending}
    </h3>
  </div>

</div>

</div>

</div>

<div className="hidden lg:block text-right">

<h2 className="text-5xl font-black text-cyan-400">
{tasks.length}
</h2>

<p className="text-slate-400">
Scheduled Tasks
</p>

</div>

</div>

<div className="mt-8">

<div className="flex justify-between items-center">

<div>

<p className="text-sm text-slate-400">
Workspace Progress
</p>

<p className="text-xs text-slate-500 mt-1">
{metrics.completed} completed • {metrics.pending} pending
</p>

</div>

<span className="text-cyan-400 font-bold">
{metrics.progress}%
</span>

</div>

<div className="h-3 bg-slate-800 rounded-full overflow-hidden">

<div
className="
h-full
rounded-full
bg-gradient-to-r
from-cyan-500
to-blue-500
"
style={{
width: `${metrics.progress}%`,
}}
/>

</div>

</div>

</div>

{/* STATS */}

<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">

<StatCard
title="Completed"
value={metrics.completed}
icon={<CheckCircle2 size={30} />}
color="text-green-400"
/>

<StatCard
title="Pending"
value={metrics.pending}
icon={<Clock3 size={30} />}
color="text-yellow-400"
/>

<StatCard
title="Overdue"
value={metrics.overdue}
icon={<AlertTriangle size={30} />}
color="text-red-400"
/>

<StatCard
title="Progress"
value={`${metrics.progress}%`}
icon={<CalendarDays size={30} />}
color="text-cyan-400"
/>

</div>

{loading ? (

<div className="text-center py-20 text-slate-400">
Loading Calendar...
</div>

) : (

<div className="grid xl:grid-cols-4 gap-6">

<div
className="
xl:col-span-3
bg-slate-900
border
border-slate-800
rounded-3xl
p-8
"
>
<div className="mb-6">

<h2 className="text-2xl font-bold">
Project Calendar
</h2>

<p className="text-slate-400 mt-2">
Monitor every deadline across your workspace.
</p>

</div>
<CalendarView tasks={tasks} />

</div>

<div
className="
bg-slate-900
border
border-slate-800
rounded-3xl
p-6
sticky
top-24
h-fit
"
>
<div className="mb-5">

<h2 className="text-xl font-bold">
Upcoming Deadlines
</h2>

<p className="text-slate-400 text-sm mt-1">
Tasks requiring your attention.
</p>

</div>
<UpcomingDeadlines
tasks={tasks}
/>

</div>

</div>

      )}

    </div>

  </DashboardLayout>

  );
}