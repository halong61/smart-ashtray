import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BoothCard } from '../components/BoothCard';
import { TrendChart } from '../components/TrendChart';

type BoothStatus = 'IDLE' | 'SMOKING' | 'WARNING' | 'FIRE_DETECTED';
type SprayMode = 'AUTO' | 'OFF';
type FilterType = '전체' | '정상' | '주의' | '위험';

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

type DashboardPageProps = {
  booths: Booth[];
  onLogout?: () => void;
};

function DashboardPage({ booths, onLogout }: DashboardPageProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filter, setFilter] = useState<FilterType>('전체');

  const averageAqi = useMemo(() => {
    const total = booths.reduce((sum, booth) => sum + booth.aqi, 0);
    return Math.round(total / booths.length);
  }, [booths]);

  const alertCount = booths.filter((booth) => booth.status !== 'IDLE').length;

  const filteredBooths = useMemo(() => {
    if (filter === '전체') {
      return booths;
    }

    if (filter === '정상') {
      return booths.filter((booth) => booth.status === 'IDLE');
    }

    if (filter === '주의') {
      return booths.filter((booth) => booth.status === 'SMOKING' || booth.status === 'WARNING');
    }

    return booths.filter((booth) => booth.status === 'FIRE_DETECTED');
  }, [booths, filter]);

  const filterSummaryLabel = filter === '전체' ? '전체 부스' : `${filter} 상태`;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-700">
      {sidebarOpen ? (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-3 sm:px-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className={`fixed inset-y-0 left-0 z-30 w-[85%] max-w-sm shrink-0 rounded-r-2xl border-r border-gray-200 bg-white p-4 shadow-xl transition-transform duration-200 lg:static lg:w-72 lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between lg:justify-start">
            <div>
              <p className="text-sm font-semibold text-gray-800">Smart Clean Ashtray</p>
              <p className="text-xs text-gray-500">실시간 모니터링 패널</p>
            </div>
            <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 lg:hidden" aria-label="사이드바 토글" onClick={() => setSidebarOpen(false)}>
              닫기
            </button>
          </div>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-800">요약</p>
            <div className="mt-3 space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>평균 AQI</span>
                <span className="font-semibold text-gray-800">{averageAqi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>경고 부스</span>
                <span className="font-semibold text-gray-800">{alertCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>필터</span>
                <span className="text-gray-500">{filter}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-800">필터</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['전체', '정상', '주의', '위험'].map((item) => (
                <button
                  key={item}
                  className={`rounded-full border px-3 py-1 text-xs ${filter === item ? 'border-[#2563eb] bg-[#2563eb] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  aria-label={`${item} 필터`}
                  onClick={() => setFilter(item as FilterType)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <header className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Dashboard</p>
              <h1 className="text-xl font-semibold text-gray-800">Smart Clean Ashtray</h1>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Link to="/booths" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                등록 / 제어
              </Link>
              <div className="relative">
                <button
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
                  aria-label="필터"
                  onClick={() => setShowFilterMenu((prev) => !prev)}
                >
                  ⚙ {filter}
                </button>
                {showFilterMenu && (
                  <div className="absolute right-0 z-10 mt-2 w-44 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="text-xs font-semibold text-gray-500">상태 필터</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['전체', '정상', '주의', '위험'] as FilterType[]).map((item) => (
                        <button
                          key={item}
                          className={`rounded-full border px-2.5 py-1 text-xs ${filter === item ? 'border-[#2563eb] bg-[#2563eb] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                          onClick={() => {
                            setFilter(item);
                            setShowFilterMenu(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="rounded-lg bg-[#0F1117] px-3 py-2 text-sm text-white lg:hidden" aria-label="사이드바 열기" onClick={() => setSidebarOpen(true)}>
                메뉴
              </button>
              <button
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  }
                  navigate('/login');
                }}
              >
                로그아웃
              </button>
            </div>
          </header>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">오버뷰</p>
                  <p className="text-xs text-gray-500">전체 부스 상태와 운영 요약</p>
                </div>
                <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">정상 운영</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">평균 AQI</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-800">{averageAqi}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">경고 부스</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-800">{alertCount}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">자동 모드</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-800">{booths.filter((booth) => booth.sprayMode === 'AUTO').length}</p>
                </div>
              </div>
            </div>

            <TrendChart />
          </section>

          <section>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-gray-800">부스 목록</p>
              <p className="text-sm text-gray-500">{filterSummaryLabel} · {filteredBooths.length}개</p>
            </div>

            {filteredBooths.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center shadow-sm sm:p-8">
                <p className="text-sm font-semibold text-gray-700">선택한 조건에 맞는 부스가 없습니다.</p>
                <p className="mt-2 text-sm text-gray-500">다른 필터로 다시 확인해보세요.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredBooths.map((booth) => (
                  <BoothCard key={booth.id} {...booth} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
