import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Calendar,
  dateFnsLocalizer,
} from "react-big-calendar";

import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView({ tasks }) {
  const events = tasks
    .filter((task) => task.dueDate)
    .map((task) => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      status: task.status,
      project: task.project?.name || "",
    }));

  const eventStyleGetter = (event) => {
    // eslint-disable-next-line no-useless-assignment
    let background = "#06b6d4";

    switch (event.status) {
      case "todo":
        background = "#64748b";
        break;

      case "progress":
        background = "#f59e0b";
        break;

      case "review":
        background = "#8b5cf6";
        break;

      case "done":
        background = "#22c55e";
        break;

      default:
        background = "#06b6d4";
    }

    return {
      style: {
        backgroundColor: background,
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: "600",
        padding: "2px 6px",
      },
    };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-195">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        popup
        defaultView="month"
        views={["month", "week", "day", "agenda"]}
        eventPropGetter={eventStyleGetter}
        style={{ height: "100%" }}
      />
    </div>
  );
}