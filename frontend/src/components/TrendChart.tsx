const points = [32, 45, 41, 62, 58, 74, 69];

export function TrendChart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">실시간 트렌드</p>
          <p className="text-xs text-gray-500">지난 7시간 AQI 추이</p>
        </div>
        <span className="rounded-full bg-safe/10 px-3 py-1 text-xs font-semibold text-safe">안정적</span>
      </div>

      <div className="mt-4 flex h-32 items-end gap-2">
        {points.map((value, index) => (
          <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-accent to-safe"
              style={{ height: `${value}%` }}
            />
            <span className="text-[10px] text-gray-400">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
