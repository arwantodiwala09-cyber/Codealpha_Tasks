export default function Skeleton({
  className = "",
  rounded = "rounded-xl",
}) {
  return (
    <div
      className={`
        animate-pulse
        bg-slate-800
        ${rounded}
        ${className}
      `}
    />
  );
}

// ===============================
// Dashboard Stat Card Skeleton
// ===============================
export function StatCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-10" />
        </div>

        <Skeleton
          className="w-16 h-16"
          rounded="rounded-2xl"
        />
      </div>
    </div>
  );
}

// ===============================
// Project Card Skeleton
// ===============================
export function ProjectCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
      <Skeleton className="h-6 w-2/3" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="h-4 w-4/5" />

      <div className="flex justify-between mt-6">
        <Skeleton className="h-8 w-24" />

        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

// ===============================
// Table Skeleton
// ===============================
export function TableSkeleton({
  rows = 5,
}) {
  return (
    <div className="space-y-4">
      {Array.from({
        length: rows,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton
              className="w-12 h-12"
              rounded="rounded-full"
            />

            <div className="space-y-2">
              <Skeleton className="w-40 h-4" />

              <Skeleton className="w-28 h-3" />
            </div>
          </div>

          <Skeleton className="w-24 h-8" />
        </div>
      ))}
    </div>
  );
}

// ===============================
// Kanban Card Skeleton
// ===============================
export function KanbanCardSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-4">
      <Skeleton className="h-5 w-3/4" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="h-4 w-2/3" />

      <div className="flex justify-between">
        <Skeleton className="w-16 h-6" />

        <Skeleton className="w-20 h-6" />
      </div>
    </div>
  );
}

// ===============================
// List Skeleton
// ===============================
export function ListSkeleton({
  items = 6,
}) {
  return (
    <div className="space-y-3">
      {Array.from({
        length: items,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4"
        >
          <Skeleton
            className="w-10 h-10"
            rounded="rounded-full"
          />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />

            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}