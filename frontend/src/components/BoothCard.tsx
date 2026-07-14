import { useState } from 'react';

type BoothStatus = 'IDLE' | 'SMOKING' | 'WARNING' | 'FIRE_DETECTED';

type BoothCardProps = {
  id: string;
  name: string;
  floor?: string;
  aqi: number;
  cigarettePct: number;
  waterPct: number;
  status: BoothStatus;
};

const statusStyles: Record<BoothStatus, { badge: string; ring: string; dot: string }> = {
  IDLE: { badge: 'bg-[#2ecc71]/15 text-[#2ecc71]', ring: 'border-[#2ecc71]/20', dot: 'bg-[#2ecc71]' },
  SMOKING: { badge: 'bg-[#f1c40f]/15 text-[#f1c40f]', ring: 'border-[#f1c40f]/20', dot: 'bg-[#f1c40f]' },
  WARNING: { badge: 'bg-[#e74c3c]/15 text-[#e74c3c]', ring: 'border-[#e74c3c]/20', dot: 'bg-[#e74c3c]' },
  FIRE_DETECTED: { badge: 'bg-[#9b59b6]/15 text-[#9b59b6]', ring: 'border-[#9b59b6]/20', dot: 'bg-[#9b59b6]' },
};

export function BoothCard({ id, name, floor, aqi, cigarettePct, waterPct, status }: BoothCardProps) {
  const styles = statusStyles[status];
  const [isSpraying, setIsSpraying] = useState(false);

  const handleManualSpray = () => {
    setIsSpraying(true);
    window.setTimeout(() => setIsSpraying(false), 1200);
  };

  const cigaretteFillColor = cigarettePct >= 80 ? 'bg-[#e74c3c]' : cigarettePct >= 50 ? 'bg-[#f1c40f]' : 'bg-[#2ecc71]';
  const cigaretteLabel = cigarettePct >= 80 ? '가득 참' : cigarettePct >= 50 ? '보통' : '여유 있음';

  return (
    <article
      className={`group rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:outline-none focus-within:ring-2 focus-within:ring-accent ${styles.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">{id}</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{floor ?? '공용 구역'}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          {status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">AQI</p>
          <p className="mt-1 text-lg font-semibold text-gray-800">{aqi}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">재떨이</p>
          <div className="mt-2 h-2 rounded-full bg-gray-200">
            <div className={`h-2 rounded-full transition-all ${cigaretteFillColor}`} style={{ width: `${Math.min(cigarettePct, 100)}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-800">{cigarettePct}%</p>
          <p className="text-[11px] text-gray-500">{cigaretteLabel}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Water</p>
          <p className="mt-1 text-lg font-semibold text-gray-800">{waterPct}%</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleManualSpray}
        className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold transition ${isSpraying ? 'bg-[#2563eb] text-white' : 'bg-[#eaf2ff] text-[#2563eb] hover:bg-[#dbeafe]'}`}
      >
        {isSpraying ? '살수 중...' : '수동 살수'}
      </button>
    </article>
  );
}
