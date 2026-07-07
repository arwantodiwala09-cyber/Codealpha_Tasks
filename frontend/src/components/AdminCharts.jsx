import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#06b6d4",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
];

export default function AdminCharts({
  taskStatusChart,
  roleDistribution,
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-10">

      {/* Task Status */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-6
          shadow-xl
          shadow-cyan-500/5
        "
      >
        <h2 className="text-2xl font-bold mb-6">
          Task Status Distribution
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={taskStatusChart}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {taskStatusChart?.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role Distribution */}
      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-3xl
          p-6
          shadow-xl
          shadow-cyan-500/5
        "
      >
        <h2 className="text-2xl font-bold mb-6">
          User Role Distribution
        </h2>

        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={
                  roleDistribution
                }
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={110}
                label
              >
                {roleDistribution?.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}