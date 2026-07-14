import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Link } from 'react-router-dom';

type BoothStatus = 'IDLE' | 'SMOKING' | 'WARNING' | 'FIRE_DETECTED';
type SprayMode = 'AUTO' | 'OFF';

type Booth = {
  id: string;
  name: string;
  floor: string;
  location: string;
  status: BoothStatus;
  aqi: number;
  cigarettePct: number;
  waterPct: number;
  sprayMode: SprayMode;
  lastSprayAt: string | null;
  sprayCount: number;
};

type BoothManagementPageProps = {
  booths: Booth[];
  setBooths: Dispatch<SetStateAction<Booth[]>>;
};

function BoothManagementPage({ booths, setBooths }: BoothManagementPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', floor: '', location: '' });

  const totalWater = useMemo(() => booths.reduce((sum, booth) => sum + booth.waterPct, 0), [booths]);
  const autoEnabledCount = booths.filter((booth) => booth.sprayMode === 'AUTO').length;
  const waterLowCount = booths.filter((booth) => booth.waterPct < 25).length;

  const handleAddBooth = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.floor || !formData.location) {
      return;
    }

    const nextBooth: Booth = {
      id: `B-${String(booths.length + 1).padStart(3, '0')}`,
      name: formData.name,
      floor: formData.floor,
      location: formData.location,
      status: 'IDLE',
      aqi: 56,
      cigarettePct: 30,
      waterPct: 60,
      sprayMode: 'OFF',
      lastSprayAt: null,
      sprayCount: 0,
    };

    setBooths((current) => [nextBooth, ...current]);
    setFormData({ name: '', floor: '', location: '' });
    setIsFormOpen(false);
  };

  const adjustWater = (id: string, delta: number) => {
    setBooths((current) =>
      current.map((booth) =>
        booth.id === id ? { ...booth, waterPct: Math.max(0, Math.min(100, booth.waterPct + delta)) } : booth,
      ),
    );
  };

  const toggleSprayMode = (id: string) => {
    setBooths((current) =>
      current.map((booth) =>
        booth.id === id ? { ...booth, sprayMode: booth.sprayMode === 'AUTO' ? 'OFF' : 'AUTO' } : booth,
      ),
    );
  };

  const handleManualSpray = (id: string) => {
    setBooths((current) =>
      current.map((booth) => {
        if (booth.id !== id) {
          return booth;
        }

        if (booth.waterPct < 15) {
          return booth;
        }

        return {
          ...booth,
          waterPct: Math.max(0, booth.waterPct - 6),
          lastSprayAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          sprayCount: booth.sprayCount + 1,
        };
      }),
    );
  };

  const handleDeleteBooth = (id: string) => {
    setBooths((current) => current.filter((booth) => booth.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-3 py-3 text-gray-700 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Booth Manager</p>
            <h1 className="text-xl font-semibold text-gray-800">재떨이 등록 및 원격 살수 제어</h1>
          </div>
          <Link to="/dashboard" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            대시보드로 돌아가기
          </Link>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">안전·운영 요약</p>
                <p className="text-xs text-gray-500">자동 분사, 수동 분사, 수위 경고</p>
              </div>
              <span className="rounded-full bg-[#0F1117] px-3 py-1 text-xs font-semibold text-white">{booths.length}개 등록</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-500">평균 수위</p>
                <p className="mt-1 text-2xl font-semibold text-gray-800">{Math.round(totalWater / booths.length)}%</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">자동 모드</p>
                  <p className="mt-1 text-xl font-semibold text-gray-800">{autoEnabledCount}개</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">수위 저하 경고</p>
                  <p className="mt-1 text-xl font-semibold text-gray-800">{waterLowCount}개</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 p-3">
                <p className="text-sm font-semibold text-gray-800">안전 원칙</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>• 수위가 낮으면 분사 금지 및 정비 알림을 표시합니다.</li>
                  <li>• 화재 상황에서는 물 대신 CO2·소화제 검토가 필요합니다.</li>
                  <li>• 방수·절연·과분사 방지 설계가 우선입니다.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {booths.map((booth) => {
              const isWaterLow = booth.waterPct < 25;
              return (
                <article key={booth.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{booth.name}</p>
                      <p className="text-xs text-gray-500">{booth.floor} · {booth.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isWaterLow ? 'bg-[#fef2f2] text-[#dc2626]' : 'bg-[#eaf2ff] text-[#2563eb]'}`}>
                        {isWaterLow ? 'Water Low' : 'Water OK'}
                      </span>
                      <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-semibold text-gray-700">{booth.status}</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>재떨이 내부 수위</span>
                      <span>{booth.waterPct}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: `${booth.waterPct}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className={`rounded-lg px-3 py-2 text-sm ${booth.sprayMode === 'AUTO' ? 'bg-[#0F1117] text-white' : 'border border-gray-200 text-gray-600'}`}
                      onClick={() => toggleSprayMode(booth.id)}
                    >
                      {booth.sprayMode === 'AUTO' ? '자동모드 ON' : '자동모드 OFF'}
                    </button>
                    <button
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
                      onClick={() => handleManualSpray(booth.id)}
                      disabled={booth.waterPct < 15}
                    >
                      {booth.waterPct < 15 ? '수동 분사 불가' : '수동 분사'}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span>최근 분사: {booth.lastSprayAt ?? '미기록'}</span>
                    <span>누적 분사 {booth.sprayCount}회</span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600" onClick={() => adjustWater(booth.id, -10)}>
                      -10%
                    </button>
                    <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600" onClick={() => adjustWater(booth.id, 10)}>
                      +10%
                    </button>
                    <button className="rounded-lg border border-[#ef4444]/30 px-3 py-2 text-sm text-[#ef4444]" onClick={() => handleDeleteBooth(booth.id)}>
                      삭제
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </div>

        <button
          className="fixed bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0F1117] text-3xl text-white shadow-lg sm:bottom-6 sm:right-6"
          aria-label="새 재떨이 등록"
          onClick={() => setIsFormOpen(true)}
        >
          +
        </button>
      </div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">새 재떨이 등록</p>
                <p className="text-xs text-gray-500">이름, 층, 위치를 입력하세요</p>
              </div>
              <button className="text-sm text-gray-500" onClick={() => setIsFormOpen(false)}>
                닫기
              </button>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleAddBooth}>
              <label className="block text-sm text-gray-600">
                이름
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  placeholder="예: 휴게실"
                />
              </label>
              <label className="block text-sm text-gray-600">
                층
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={formData.floor}
                  onChange={(event) => setFormData((current) => ({ ...current, floor: event.target.value }))}
                  placeholder="예: 2F"
                />
              </label>
              <label className="block text-sm text-gray-600">
                위치
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                  value={formData.location}
                  onChange={(event) => setFormData((current) => ({ ...current, location: event.target.value }))}
                  placeholder="예: 휴게실 중앙"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600" onClick={() => setIsFormOpen(false)}>
                  취소
                </button>
                <button type="submit" className="rounded-lg bg-[#0F1117] px-3 py-2 text-sm text-white">
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BoothManagementPage;
