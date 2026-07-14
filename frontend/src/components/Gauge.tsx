type GaugeProps = {
  label: string;
  value: number;
  tone?: string;
};

export function Gauge({ label, value, tone = 'text-safe' }: GaugeProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className={`text-3xl font-semibold ${tone}`}>{value}</span>
        <span className="pb-1 text-sm text-gray-400">%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${tone.replace('text-', 'bg-')}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}
