import React from "react";

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded-md bg-slate-200"></div>
        <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
      </div>
      <div className="mt-4 h-8 w-16 rounded-md bg-slate-200"></div>
      <div className="mt-2 h-3 w-32 rounded-md bg-slate-200"></div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="h-5 w-48 rounded-md bg-slate-200"></div>
      </div>
      <div className="divide-y divide-slate-100 px-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded-md bg-slate-200"></div>
              <div className="h-3 w-20 rounded-md bg-slate-200"></div>
            </div>
            <div className="h-4 w-16 rounded-md bg-slate-200"></div>
            <div className="h-7 w-20 rounded-full bg-slate-200"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TableSkeleton rows={4} />
        </div>
        <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-32 rounded-md bg-slate-200"></div>
          <div className="mt-6 flex justify-center">
            <div className="h-40 w-40 rounded-full border-12 border-slate-200"></div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded-md bg-slate-200"></div>
            <div className="h-4 w-2/3 rounded-md bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardSkeleton;
